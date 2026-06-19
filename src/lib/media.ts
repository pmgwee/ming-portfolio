/* ------------------------------------------------------------------ */
/*  Media origin helper — offload heavy static media to S3/CloudFront  */
/* ------------------------------------------------------------------ */
/*
 * Heavy media (hero frame sequence + showcase videos) is referenced through
 * `media("/frames/...")` / `media("/video2/...")`. The path prefix comes from
 * NEXT_PUBLIC_MEDIA_BASE:
 *
 *   • Local dev  — unset → "" → served from /public (files stay on disk).
 *   • Production — "https://dXXXXX.cloudfront.net" → served from S3 via CloudFront.
 *
 * NEXT_PUBLIC_* vars are inlined at BUILD time, so set the env var in Vercel
 * (Production/Preview) before deploying. No trailing slash on the value.
 *
 * The hero canvas only DRAWS frames (no pixel readback), so cross-origin media
 * works without CORS headers — do NOT add crossOrigin="anonymous" (that would
 * require a CORS config on the bucket and break loading if absent).
 */
const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE ?? "").replace(/\/$/, "");

/** Prefix a root-relative media path (e.g. "/video2/x.mp4") with the offload origin. */
export const media = (path: string) => `${MEDIA_BASE}${path}`;
