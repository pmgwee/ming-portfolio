# Deployment & media hosting

**Hosting:** [Vercel](https://vercel.com) (Next.js frontend) + **AWS S3 behind CloudFront**
(heavy media offload).

Heavy media — the hero frame sequence (`/frames/*`) and the showcase videos
(`/video1/*`, `/video2/*`, future `/showcase/*`) — lives in S3 and is served
through CloudFront. The app references it via the `NEXT_PUBLIC_MEDIA_BASE` env
var and the `media()` helper in [`src/lib/media.ts`](src/lib/media.ts):

- **Local dev:** `NEXT_PUBLIC_MEDIA_BASE` unset → `""` → media serves from `/public`
  (files stay on disk; no setup needed).
- **Production:** `NEXT_PUBLIC_MEDIA_BASE=https://dXXXXX.cloudfront.net` → media
  serves from S3 via CloudFront.

> The hero canvas only *draws* frames (no pixel readback), so cross-origin media
> works **without CORS** headers. Do **not** add `crossOrigin="anonymous"` — that
> would require a bucket CORS config and break loading if it's missing.

---

## Phase A — AWS (you run this)

### 0. Prerequisites
- AWS account; an IAM user with `AmazonS3FullAccess` + `CloudFrontFullAccess`
  (or scoped equivalents). `aws configure` with its access key + secret.
- Vercel project already linked to the GitHub repo.

### 1. Create a **private** S3 bucket
```bash
aws s3api create-bucket \
  --bucket ming-portfolio-media \
  --region us-east-1 \
  --object-ownership BucketOwnerEnforced
```
Keep **"Block *all* public access" ON**. The bucket stays private; CloudFront
reads it via Origin Access Control.

### 2. Upload the media (preserve the path prefixes the code expects)
```bash
aws s3 sync public/frames s3://ming-portfolio-media/frames --include "*.jpg"
aws s3 sync public/video1 s3://ming-portfolio-media/video1
aws s3 sync public/video2 s3://ming-portfolio-media/video2
```
The AWS CLI infers `ContentType` from the extension (`.mp4` → `video/mp4`,
`.jpg` → `image/jpeg`) — browsers need these for correct playback. (If you upload
via the console instead, set Content-Type manually.)

> Future showcase clips go to `s3://ming-portfolio-media/showcase/clip-01.mp4`
> and are referenced as `media("/showcase/clip-01.mp4")` in `SHOWCASE_VIDEOS`
> ([src/lib/showcase.ts](src/lib/showcase.ts)).

### 3. Create the CloudFront distribution
Console → **CloudFront → Create distribution**:
- **Origin domain:** pick `ming-portfolio-media.s3.us-east-1.amazonaws.com`.
- **Origin access → Origin access control settings (recommended)** → create an
  OAC; AWS offers to auto-apply the bucket policy that lets CloudFront read the
  private bucket — accept it.
- **Viewer protocol policy:** Redirect HTTP to HTTPS.
- **Cache policy:** `CachingOptimized` (ideal for static media).
- **Price class:** "Use only North America and Europe" (cheapest — bump up if
  you have global traffic).
- **WAF:** disable (saves cost).
- Create, then wait ~5 min to deploy.

Copy the **Distribution domain name**, e.g. `d1234567890.cloudfront.net`.

### 4. Set the env var in Vercel
**Vercel → Project → Settings → Environment Variables:**
- `NEXT_PUBLIC_MEDIA_BASE` = `https://d1234567890.cloudfront.net` *(no trailing slash)*
- Apply to **Production** and **Preview** (and Development if you want dev to hit S3).

`NEXT_PUBLIC_*` is inlined at **build** time — set this **before** the deploy.

---

## Phase B — code (already done in this branch)

- [`src/lib/media.ts`](src/lib/media.ts) — the `media(path)` helper.
- [`src/lib/hero.ts`](src/lib/hero.ts) — `frameSrc()` routes frames through `media()`.
- [`src/lib/showcase.ts`](src/lib/showcase.ts) — `SHOWCASE_VIDEOS[].src` routed through `media()`.
- [`.gitignore`](.gitignore) — heavy media folders ignored (kept on disk for dev).
- [`.env.example`](.env.example) — documents `NEXT_PUBLIC_MEDIA_BASE`.

---

## Phase C — repo cleanup + deploy (run after Phase A is verified)

### 5. Untrack the heavy media (files stay on disk)
```bash
git rm -r --cached public/frames public/video1 public/video2
git commit -m "chore: offload heavy media to S3/CloudFront"
```

### 6. Purge the media from git history (80MB → ~1MB)
Using [git-filter-repo](https://github.com/newren/git-filter-repo) (`pip install git-filter-repo`):
```bash
git filter-repo --invert-paths \
  --path public/frames --path public/video1 --path public/video2
# filter-repo removes the remote for safety — re-add it:
git remote add origin https://github.com/pmgwee/ming-portfolio.git
git push --force origin main
```
⚠️ `--force` rewrites remote history. Safe here (solo repo, few commits) — anyone
with a clone must re-clone. (Alternative: [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
with `--delete-folders '{public/frames,public/video1,public/video2}'`.)

### 7. Deploy + verify
The force-push triggers Vercel's auto-deploy (or click **Redeploy**). Confirm:
- Hero frames load from `*.cloudfront.net` (DevTools → Network → filter "cloudfront"),
  cached (304/from cache) on repeat visits.
- Showcase videos play; the Unmute pill toggles audio.
- GitHub repo size is ~1MB (Settings → repository size).

---

## Cost
- S3 storage for ~80 MB ≈ cents/month.
- CloudFront egress is within the free tier for a portfolio's traffic.
- Vercel Hobby = free.
- The $100 AWS credit covers years of this kind of traffic.

## Future optimization (optional, out of scope)
The 59 MB hero frame sequence (240 JPGs) is the single heaviest payload.
Converting it to one scrubbed `<video>` (mp4/webm) would cut it to a few MB — a
separate change in [`Hero.tsx`](src/components/sections/Hero.tsx), not required
for this deploy.
