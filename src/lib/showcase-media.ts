import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

/* ------------------------------------------------------------------ */
/*  Showcase media — live listing of the field tiles + carousel clips  */
/*  in S3. Server-only (uses a read-only IAM key); imported by the      */
/*  page (RSC, baked at build + ISR-revalidated) and the /api/media     */
/*  route. Keeping it here means the browser never waterfalls a fetch   */
/*  just to learn the media URLs.                                       */
/* ------------------------------------------------------------------ */

/**
 * Returns, from the private media bucket:
 *   • `tiles`  — every image AND short looping clip under the `temp_pictures/`
 *                prefix (the mixed image-field pool; order-agnostic, all used).
 *   • `videos` — every clip under the single `video/` folder, as an ORDERED
 *                array of URLs (alphabetical by key). Each becomes one carousel
 *                slide, so dropping N clips into the folder yields N slides.
 *
 * So dropping a new batch of arbitrarily-named files into a folder on S3 "just
 * works" with no code change. The bucket is private (CloudFront OAC), so the
 * browser can't list it; this does the SigV4-signed ListObjectsV2 with a
 * read-only IAM key. Missing creds (e.g. local dev) → empty lists, UI degrades
 * gracefully instead of throwing.
 */

const REGION = process.env.S3_REGION ?? "ap-southeast-2";
const BUCKET = process.env.S3_BUCKET ?? "";
const TILES_PREFIX = process.env.S3_TILES_PREFIX ?? "temp_pictures/";
const VIDEO_PREFIX = process.env.S3_VIDEO_PREFIX ?? "video/";
// Reuse the public CloudFront base the client already uses (no trailing slash).
const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE ?? "").replace(/\/+$/, "");

const IMAGE_RE = /\.(webp|avif|png|jpe?g)$/i;
const VIDEO_RE = /\.(mp4|webm|mov|m4v)$/i;

export type ShowcaseMedia = {
  tiles: string[];
  videos: string[];
};

type Item = { key: string; lastModified: number };

function makeClient(): S3Client | null {
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
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

export async function getShowcaseMedia(): Promise<ShowcaseMedia> {
  const s3 = makeClient();
  if (!s3) return { tiles: [], videos: [] };

  try {
    const [tileItems, videoItems] = await Promise.all([
      listPrefix(s3, TILES_PREFIX),
      listPrefix(s3, VIDEO_PREFIX),
    ]);

    // The field pool is mixed media: still images AND short looping clips
    // (muted .mp4 etc.) dropped into the same prefix. Both flow through the
    // field; the client renders a <video> for clips and an <img> for images.
    const tiles = tileItems
      .filter((it) => IMAGE_RE.test(it.key) || VIDEO_RE.test(it.key))
      .map((it) => urlFor(it.key))
      .sort();

    // Every clip in the single video/ folder, alphabetical by key → one
    // carousel slide each (control order by naming files 01-…, 02-…).
    const videos = videoItems
      .filter((it) => VIDEO_RE.test(it.key))
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((it) => urlFor(it.key));

    return { tiles, videos };
  } catch {
    // Never hard-fail the page over decorative/media listing.
    return { tiles: [], videos: [] };
  }
}
