/* ------------------------------------------------------------------ */
/*  Media offload — CDN base resolver (S3 + CloudFront)                 */
/* ------------------------------------------------------------------ */

/**
 * Prepends the CDN base (CloudFront) to a public media path when configured.
 * Empty/unset NEXT_PUBLIC_MEDIA_BASE → serves from /public (local fallback).
 *
 * NEXT_PUBLIC_* is inlined at build time, so reading it at module scope is
 * safe and works in the browser. The env value carries no trailing slash and
 * every `path` starts with "/", so concatenation yields a clean absolute URL
 * (e.g. https://d111.cloudfront.net/frames/frame_0001.jpg).
 */
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE ?? "";

export const mediaUrl = (path: string): string =>
  MEDIA_BASE ? `${MEDIA_BASE}${path}` : path;
