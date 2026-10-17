# Studio journey — review asset v1

Source supplied and selected by Ming: hf_20261017_041740_2fe5f4c1-8436-4c2f-b484-7a33b69d8210.mp4 (15-second AI-generated film, 1920x1080, 30fps). The character and setting are imagined, not documentary footage.

film-1080.mp4 and film-720.mp4 retain all 450 frames at 30fps with the same order, timing and framing. No transitions were edited, no motion interpolation or crop applied. Audio removed. H.264 keyframes every three frames and fast-start metadata support scroll seeking; 1080p CRF23, 720p CRF24. Poster is the opening frame; ending.webp is the source at 14.8s. Both WebP quality85, extracted with FFmpeg.

These versioned assets are committed so the review branch works without changing the shared S3 bucket. They bypass NEXT_PUBLIC_MEDIA_BASE; do not point them at CloudFront before the same versioned assets exist there. A future media move must preserve these timings and paths or update HERO_FILM in src/lib/hero-story.ts.

All headings, paragraphs, numbers, navigation and buttons are HTML. The supplied glass lettering is left as generated; its shape has not been corrected through CSS or new video generation.
