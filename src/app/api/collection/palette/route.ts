import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import sharp from "sharp";
import { getShowcaseMedia } from "@/lib/showcase-media";
import { collectionKey, isCollectionVideo } from "@/lib/collection";

export const runtime = "nodejs";
const listedMedia = unstable_cache(getShowcaseMedia, ["collection-palette-allowlist"], { revalidate: 3600 });
const MAX_BYTES = 8 * 1024 * 1024;

const samplePalette = unstable_cache(async (src: string) => {
  // The caller resolves src against our own published S3 listing. Never proxy
  // an arbitrary user URL, follow redirects, or read EXIF/private location data.
  const response = await fetch(src, { redirect: "error", signal: AbortSignal.timeout(8000) });
  if (!response.ok || !response.body || Number(response.headers.get("content-length")) > MAX_BYTES) throw new Error("Unavailable image");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > MAX_BYTES) throw new Error("Image too large");
      chunks.push(value);
    }
  } finally { await reader.cancel(); }
  const pixels = await sharp(Buffer.concat(chunks), { limitInputPixels: 40_000_000 })
    .rotate().resize(64, 64, { fit: "inside" }).removeAlpha().toColourspace("srgb").raw().toBuffer();
  const bins = new Map<string, { rgb: number[]; count: number }>();
  for (let i = 0; i < pixels.length; i += 3) {
    const rgb = [pixels[i], pixels[i + 1], pixels[i + 2]];
    const key = rgb.map(v => Math.floor(v / 32)).join(",");
    const bin = bins.get(key) ?? { rgb: [0, 0, 0], count: 0 };
    rgb.forEach((v, j) => bin.rgb[j] += v);
    bin.count++;
    bins.set(key, bin);
  }
  const ranked = [...bins.values()].sort((a, b) => b.count - a.count)
    .map(b => b.rgb.map(v => Math.round(v / b.count)));
  const chosen: number[][] = [];
  for (const rgb of ranked) {
    if (chosen.every(c => Math.hypot(...rgb.map((v, i) => v - c[i])) > 55)) chosen.push(rgb);
    if (chosen.length === 5) break;
  }
  return chosen.sort((a, b) => a.reduce((x, y) => x + y) - b.reduce((x, y) => x + y))
    .map(rgb => "#" + rgb.map(v => v.toString(16).padStart(2, "0")).join(""));
}, ["collection-image-palette-v1"], { revalidate: 86400 });

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key || key.length > 1024) return NextResponse.json({ error: "Unknown image" }, { status: 400 });
  const media = await listedMedia();
  const src = media.tiles.find(url => collectionKey(url) === key && !isCollectionVideo(url));
  if (!src) return NextResponse.json({ error: "Unknown image" }, { status: 404 });
  try {
    return NextResponse.json({ colors: await samplePalette(src) }, {
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Palette unavailable" }, { status: 503 });
  }
}
