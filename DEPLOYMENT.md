# Deployment & media hosting

**Hosting:** [Vercel](https://vercel.com) (Next.js frontend) + **AWS S3 behind CloudFront**
(heavy media offload).

Heavy media — the hero frame sequence (`/frames/*`) and the showcase carousel
clips (`/video/*`) — lives in S3 and is served
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
Always pass `--cache-control` so browsers cache media long-term — without it
(the old default) every **refresh re-downloads tens of MB**. The media is
effectively immutable (new batches get new filenames), so a 1-year TTL is safe;
when you *replace* a file in place, invalidate CloudFront (step 7 / 4b).
```bash
CC="public, max-age=31536000, immutable"
# Frames live under a versioned prefix (frames/<FRAMES_VERSION>) — see the
# "Replacing the hero frames" section. Match FRAMES_VERSION in src/lib/hero.ts.
aws s3 sync public/frames        s3://ming-portfolio-media/frames/v1     --include "*.jpg" --cache-control "$CC"
aws s3 sync public/temp_pictures s3://ming-portfolio-media/temp_pictures --cache-control "$CC"
aws s3 sync public/video         s3://ming-portfolio-media/video         --cache-control "$CC"
```
The AWS CLI infers `ContentType` from the extension (`.mp4` → `video/mp4`,
`.jpg` → `image/jpeg`, `.webp` → `image/webp`) — browsers need these for correct
playback. (If you upload via the console instead, set Content-Type + Cache-Control
manually.)

> **Already uploaded without Cache-Control?** Stamp it on the existing objects
> in place (no re-upload of bytes), then invalidate so the edge re-reads headers:
> ```bash
> CC="public, max-age=31536000, immutable"
> for p in frames temp_pictures video; do
>   aws s3 cp "s3://ming-portfolio-media/$p" "s3://ming-portfolio-media/$p" \
>     --recursive --metadata-directive REPLACE --cache-control "$CC"
> done
> aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
> ```
> `CachingOptimized` already forwards these origin headers to the browser, so
> repeat visits then load every frame/tile/clip from disk cache — no network,
> no loading spinner.

> Add a carousel slide by dropping another clip into `s3://ming-portfolio-media/video/`
> (e.g. `01-flow-state.mp4`) — it's listed automatically, in alphabetical
> filename order, with no code change (see [src/lib/showcase.ts](src/lib/showcase.ts)).

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

### 4b. Showcase media — live S3 listing (`/api/media`)
The Showcase no longer hardcodes media filenames. The `/api/media` route
([src/app/api/media/route.ts](src/app/api/media/route.ts)) lists the bucket at
request time and returns:
- **tiles** — every image under `temp_pictures/` (the image-field pool), and
- **videos** — every clip in the single `video/` folder, as an ordered array
  (alphabetical by filename). Each becomes one carousel slide.

So dropping a new batch of **arbitrarily-named** files into a folder on S3 is
picked up with **no code change**: new tiles appear in the field, and every clip
added to `video/` becomes a carousel slide (ordered by filename — name them
`01-…`, `02-…` to control order). To enable it:

#### Create the read-only IAM key (this is your `S3_ACCESS_KEY_ID` / `_SECRET`)
The bucket policy you already have (CloudFront OAC → `s3:GetObject`) is separate
and stays as-is — this is a **new IAM user** just for *listing*:
1. AWS Console → **IAM → Users → Create user** (e.g. `ming-portfolio-lister`),
   **no** console access.
2. **Permissions → Attach policies → Create inline policy → JSON**, paste
   (`s3:ListBucket` only — listing object keys; the browser still fetches the
   bytes through CloudFront, so no `GetObject` is needed here):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Action": "s3:ListBucket",
       "Resource": "arn:aws:s3:::s3-ming-portfolio-web"
     }]
   }
   ```
   (Whole-bucket because the route lists several prefixes. To tighten it, add a
   `Condition` with `StringLike` `s3:prefix` listing `temp_pictures/*`,
   `video/*`.)
3. Create the user → open it → **Security credentials → Create access key →
   "Application running outside AWS"**. Copy the **Access key ID** and **Secret
   access key** (the secret is shown once).

#### Set the server-side env vars in Vercel (Production + Preview)
These are **not** `NEXT_PUBLIC_*`, so they stay on the server, out of the browser
bundle:
- `S3_REGION` = `ap-southeast-2`
- `S3_BUCKET` = `s3-ming-portfolio-web`
- `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` = the read-only key from above
- `S3_TILES_PREFIX` = `temp_pictures/` *(optional; this is the default)*
- `S3_VIDEO_PREFIX` = `video/` *(optional; this is the default)*

> The route is prerendered at build with a 1 h revalidate, so set these
> **before** the deploy and they bake into the first listing; it refreshes
> hourly after. When you **replace** an existing key in place, still invalidate
> CloudFront (`/temp_pictures/*` or `/*`) — same-key replacements stay
> edge-cached. Brand-new filenames are a cache miss automatically.

---

## Phase B — code (already done in this branch)

- [`src/lib/media.ts`](src/lib/media.ts) — the `media(path)` helper.
- [`src/lib/hero.ts`](src/lib/hero.ts) — `frameSrc()` routes frames through `media()`.
- [`src/lib/showcase.ts`](src/lib/showcase.ts) — `labelFromUrl()` derives each
  slide's label from its clip filename; the carousel is driven by `/api/media`.
- [`src/app/api/media/route.ts`](src/app/api/media/route.ts) — lists tiles +
  every clip in the `video/` folder, ordered (see 4b).
- [`.gitignore`](.gitignore) — heavy media folders ignored (kept on disk for dev).
- [`.env.example`](.env.example) — documents `NEXT_PUBLIC_MEDIA_BASE` + the
  `S3_*` listing vars.

---

## Phase C — repo cleanup + deploy (run after Phase A is verified)

### 5. Untrack the heavy media (files stay on disk)
```bash
git rm -r --cached public/frames public/video
git commit -m "chore: offload heavy media to S3/CloudFront"
```

### 6. Purge the media from git history (80MB → ~1MB)
Using [git-filter-repo](https://github.com/newren/git-filter-repo) (`pip install git-filter-repo`):
```bash
git filter-repo --invert-paths \
  --path public/frames --path public/video
# filter-repo removes the remote for safety — re-add it:
git remote add origin https://github.com/pmgwee/ming-portfolio.git
git push --force origin main
```
⚠️ `--force` rewrites remote history. Safe here (solo repo, few commits) — anyone
with a clone must re-clone. (Alternative: [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
with `--delete-folders '{public/frames,public/video}'`.)

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

## Hero frame sequence — current state
`FRAME_COUNT` is **169** ([`src/lib/hero.ts`](src/lib/hero.ts)) and MUST equal the
number of `frame_XXXX.jpg` files in `s3://…/frames/<FRAMES_VERSION>/`
(`frame_0001` … `frame_0169`). The preload is **blocking**
([`useImagePreloader`](src/hooks/useImagePreloader.ts)): the "Loading experience"
overlay stays until *every* frame is loaded, so the scroll-scrub never lands on a
blank/half-loaded frame even if the user scrolls immediately. Keep the frame count
low + compress the JPGs so this wait stays short.

### Replacing the hero frames (versioned — instant, no invalidation)
Frame URLs are **fixed** (`frame_0001…`) and the JPGs are uploaded `immutable`, so
re-uploading them *in place* never reaches a returning browser — a CloudFront
invalidation only clears the edge, not visitors' browser caches. So the frame path
is **versioned** via `FRAMES_VERSION` in [`src/lib/hero.ts`](src/lib/hero.ts). To
swap the hero footage:
1. Extract the new sequence to exactly `FRAME_COUNT` JPGs named `frame_0001.jpg …`.
2. Upload them to a **new** prefix, e.g. `s3://…/frames/v2/` (keep the immutable
   `--cache-control`, since a versioned path never needs busting):
   ```bash
   CC="public, max-age=31536000, immutable"
   aws s3 sync ./new-frames s3://ming-portfolio-media/frames/v2 --include "*.jpg" --cache-control "$CC"
   ```
3. Bump `export const FRAMES_VERSION = "v2";` in `hero.ts` and redeploy.

A new path = a brand-new URL, so every browser and CloudFront fetch the new frames
immediately — **no invalidation, no stale cache**. (Old `frames/v1/` can be deleted
once `v2` is live.)

### Future optimization (optional, out of scope)
Converting the sequence to one scrubbed `<video>` (mp4/webm) would cut it from
tens of MB to a few — a separate change in
[`Hero.tsx`](src/components/sections/Hero.tsx), not required for this deploy.

Recap of the answer:

- Tiles/videos refresh because each upload gets a new filename = new URL (nothing cached to be stale). Frames don't, because they reuse the same filenames = same URLs + the immutable header → your browser serves them stale.
- Your CloudFront invalidations clear the CDN edge only, never the browser — that's why they don't fix frames.
- Both frames and tiles/videos are cached on refresh; neither re-downloads. The video "reloading" look is just <video> re-initializing playback, not a network re-fetch.
- revalidate (page listing freshness) and CloudFront invalidation (file bytes) are separate layers — no conflict, nothing to remove.
- 
Browser cache   →   CloudFront edge (the CDN)   →   S3 (origin)
(on your disk)      (cache near the visitor)        (the real file)

Warehouse analogy:

S3 = the central warehouse (original stock).
CloudFront (CDN) = local convenience stores near customers, stocking copies of popular items.
Browser cache = the customer's pantry at home.

To get an item you check your pantry first, then the nearby store, then the store orders from the warehouse.

