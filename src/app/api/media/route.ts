import { NextResponse } from "next/server";
import { getShowcaseMedia } from "@/lib/showcase-media";

/* ------------------------------------------------------------------ */
/*  GET /api/media — live listing of the showcase media in S3          */
/* ------------------------------------------------------------------ */
/**
 * Thin wrapper over getShowcaseMedia() ([src/lib/showcase-media.ts]) so the
 * listing logic is shared with the page (which now resolves the URLs at build
 * + ISR and passes them down, so the browser no longer needs this fetch). Kept
 * for completeness / any future client-side refresh.
 *
 * The bucket is private (CloudFront OAC), so the browser can't list it; the
 * shared util does the SigV4-signed ListObjectsV2 with a read-only IAM key.
 */

// AWS SDK needs the Node.js runtime (not Edge).
export const runtime = "nodejs";
// Re-list S3 at most once an hour (response cached); plenty for a portfolio.
export const revalidate = 3600;

export async function GET() {
  const media = await getShowcaseMedia();
  return NextResponse.json(media, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
