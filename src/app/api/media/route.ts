import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { SHOWCASE_VIDEOS } from "@/lib/showcase";

/* ------------------------------------------------------------------ */
/*  GET /api/media — live listing of the showcase media in S3          */
/* ------------------------------------------------------------------ */
/**
 * Returns, from the private media bucket:
 *   • `tiles`  — every image under the `temp_pictures/` prefix (the image-field
 *                pool; order-agnostic, all used).
 *   • `videos` — folder → CURRENT clip URL, for each distinct folder referenced
 *                by SHOWCASE_VIDEOS (the carousel). "Current" = newest object in
 *                the folder by LastModified.
 *
 * So dropping a new batch of arbitrarily-named files into a folder on S3 "just
 * works" with no code change: new tiles appear in the field, and a replacement
 * clip in `video1/` / `video2/` becomes the carousel's clip. Adding a brand-new
 * video folder only needs a new SHOWCASE_VIDEOS entry — its folder is listed
 * here automatically.
 *
 * The bucket is private (CloudFront OAC), so the browser can't list it; this
 * server route does the SigV4-signed ListObjectsV2 with a read-only IAM key.
 * Note: when REPLACING an existing key in place, still invalidate CloudFront —
 * brand-new filenames are a cache miss automatically.
 */

// AWS SDK needs the Node.js runtime (not Edge).
export const runtime = "nodejs";
// Re-list S3 at most once an hour (response cached); plenty for a portfolio.
export const revalidate = 3600;

const REGION = process.env.S3_REGION ?? "ap-southeast-2";
const BUCKET = process.env.S3_BUCKET ?? "";
const TILES_PREFIX = process.env.S3_TILES_PREFIX ?? "temp_pictures/";
// Reuse the public CloudFront base the client already uses (no trailing slash).
const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE ?? "").replace(/\/+$/, "");

const IMAGE_RE = /\.(webp|avif|png|jpe?g)$/i;
const VIDEO_RE = /\.(mp4|webm|mov|m4v)$/i;

type Item = { key: string; lastModified: number };

function makeClient(): S3Client | null {
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  // Missing any of these (e.g. local dev) → caller gets empty lists and the UI
  // degrades gracefully instead of throwing.
  if (!BUCKET || !MEDIA_BASE || !accessKeyId || !secretAccessKey) return null;
  return new S3Client({ region: REGION, credentials: { accessKeyId, secretAccessKey } });
}

async function listPrefix(s3: S3Client, prefix: string): Promise<Item[]> {
  const items: Item[] = [];
  let ContinuationToken: string | undefined;
  do {
    const out = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, ContinuationToken }),
    );
    for (const obj of out.Contents ?? []) {
      if (obj.Key) items.push({ key: obj.Key, lastModified: obj.LastModified?.getTime() ?? 0 });
    }
    ContinuationToken = out.IsTruncated ? out.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return items;
}

const urlFor = (key: string) => `${MEDIA_BASE}/${key}`;

export async function GET() {
  const s3 = makeClient();
  if (!s3) return NextResponse.json({ tiles: [], videos: {} });

  try {
    // Distinct video folders the carousel references (DRY: add a slide in
    // showcase.ts → its folder is listed here automatically).
    const videoFolders = [...new Set(SHOWCASE_VIDEOS.map((s) => s.folder))];

    const [tileItems, ...videoItemLists] = await Promise.all([
      listPrefix(s3, TILES_PREFIX),
      ...videoFolders.map((f) => listPrefix(s3, `${f}/`)),
    ]);

    const tiles = tileItems
      .filter((it) => IMAGE_RE.test(it.key))
      .map((it) => urlFor(it.key))
      .sort();

    const videos: Record<string, string> = {};
    videoFolders.forEach((folder, i) => {
      const clip = videoItemLists[i]
        .filter((it) => VIDEO_RE.test(it.key))
        .sort((a, b) => b.lastModified - a.lastModified)[0];
      if (clip) videos[folder] = urlFor(clip.key);
    });

    return NextResponse.json(
      { tiles, videos },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch {
    // Never hard-fail the page over decorative/media listing — return what we have.
    return NextResponse.json({ tiles: [], videos: {} }, { status: 200 });
  }
}
