/** Public, verified credits only. Keys are decoded media paths, not signed URLs.
 * Empty fields remain unpublished until the photographer supplies the credits.
 * capturedAt is the capture date/time as supplied, never the S3 upload timestamp.
 */
export type CollectionCredit = {
  title?: string;
  description?: string;
  alt?: string;
  model?: { name: string; instagram?: string };
  location?: string;
  capturedAt?: string;
  palette?: string[];
};

// Visual descriptions reviewed against the published photographs. These are
// accessibility copy, not identity, location, or authorship claims.
const PHOTO_DESCRIPTIONS: Record<string, string> = {
  "candice 1.1.webp": "Low-angle portrait of a woman in a black top beside weathered shophouses.",
  "candice 1.2.webp": "Woman reaching toward the camera, with tall city buildings behind her.",
  "candice 1.3.webp": "Woman in a white shirt and black tie walking beside a train.",
  "candice 1.4.webp": "Close portrait of a woman holding headphones to her ears.",
  "crystal 1.1.webp": "Sunlit portrait of a woman in a white dress holding flowers, styled as a Botanical magazine cover.",
  "crystal 1.2.webp": "Soft-focus portrait through a translucent veil, with white flowers held in front of the face.",
  "crystal 1.3.webp": "Woman in a long white dress and translucent veil standing beside a tree.",
  "jasper 1.1.webp": "Man in dark winter clothing resting his arms on a snowboard in a snowy landscape.",
  "jasper 1.2.webp": "Side portrait of a man resting an arm on a snowboard, backlit by pale winter light.",
  "juyi 1.webp": "Softly lit close portrait of a woman resting her chin against her hands.",
  "juyi 2.webp": "Backlit woman viewed from behind beside a sunlit pond.",
  "juyi 3.webp": "Woman looking toward the camera through glossy green leaves.",
  "juyi 4.webp": "Summer editorial cover featuring a close portrait crossed by bands of sunlight and shadow.",
  "juyi 5.webp": "Tennis editorial portrait of a woman holding a racket against a blue-green wall.",
  "juyi 6.webp": "Woman seated on a tennis court beside a racket, with cover-style typography.",
  "miami.webp": "Man in a white T-shirt holding a colorful drink toward the camera on a sunny street.",
  "ming 1.1.webp": "Movie Times editorial cover with a man in a dark jacket on a green-lit street at night.",
  "ming 1.2.webp": "Movie Times editorial cover with a man standing before pale green storefront doors.",
  "ming 1.3.webp": "Movie Times editorial portrait of a man pointing toward the lens in front of a colorful mural.",
  "ming 2.1.webp": "Fashion cover with a man surrounded by warm curved light trails and motion blur.",
  "ming 2.2.webp": "Low-angle fashion portrait of a man extending his arms on a metal staircase at night.",
  "ming 2.3.webp": "Upward-looking fashion portrait of a man leaning against a railing under a dark sky.",
  "ming 2.4.webp": "Tilted low-angle fashion portrait framed by a metal staircase and orange-lit architecture.",
  "ming 3.1.webp": "Tilted night portrait of a man with orange-tinted glasses beside a turquoise scooter.",
  "ming 3.2.webp": "Playful close-up of a man wearing orange-tinted glasses with one hand beside his face.",
  "ming 3.3.webp": "Man with orange-tinted glasses crouching beside a turquoise scooter in a tiled interior.",
  "sakura.webp": "Low-angle silhouette beneath pink flowering branches against a pale evening sky.",
  "sayaha 1.1.webp": "Close portrait of a woman holding a bouquet of white, yellow, and pink flowers.",
  "sayaha 1.2.webp": "Woman in a flowing pale pink dress turning beside a hedge of orange flowers.",
  "sayaha 1.3.webp": "Woman twirling in a pale pink dress, her hair sweeping across her face.",
  "sayaha 1.4.webp": "Rear view of a woman in a pale pink dress walking along a tree-lined path.",
  "slyvia 1.1.webp": "Rain-soaked portrait of a woman leaning on a reflective surface among clear umbrellas.",
  "slyvia 1.2.webp": "Woman standing among open transparent umbrellas beneath a streetlight at night.",
  "slyvia 1.3.webp": "Woman seen through rain-speckled transparent umbrellas in cool night lighting.",
  "slyvia 1.4.webp": "Woman reclining among overlapping transparent umbrellas on wet ground.",
  "slyvia 1.5.webp": "Close portrait of a woman holding a clear umbrella, with wet hair framing her face.",
  "tayar 1.1.webp": "Portrait of a man in a beige button-up shirt before weathered city buildings.",
  "tayar 1.2.webp": "Man in a beige shirt standing beneath a green street sign at night.",
  "tayar 1.3.webp": "Fashion magazine-style cover with a man in a beige shirt and bold red and yellow typography.",
  "wat 1.1.webp": "Bundled figure on snowy ground beneath bright green aurora lights.",
  "yiwei 1.1.webp": "Woman with flowing brown hair holding a drink on a busy shopping street.",
  "yiwei 1.2.webp": "Woman in a white top looking into a black bag beside a street.",
  "zhan hang 1.webp": "Graduate in a purple gown posed on outdoor steps, with white handwritten-style graphics.",
  "zhan hang1.2.webp": "Graduate in a purple gown standing beside a lecture-hall sign.",
};

// Verified credits, keyed by file name like PHOTO_DESCRIPTIONS. Example:
// "candice 1.1.webp": { model: { name: "Candice", instagram: "@handle" }, location: "Kuala Lumpur", capturedAt: "March 2025" },
const PHOTO_CREDITS: Record<string, CollectionCredit> = {};

export const COLLECTION_CREDITS: Record<string, CollectionCredit> = Object.fromEntries(
  [...new Set([...Object.keys(PHOTO_DESCRIPTIONS), ...Object.keys(PHOTO_CREDITS)])].map(file => [
    `/temp_pictures/${file}`,
    { alt: PHOTO_DESCRIPTIONS[file], ...PHOTO_CREDITS[file] },
  ]),
);

export const isCollectionVideo = (src: string) => /\.(mp4|webm|mov|m4v)(?:\?|$)/i.test(src);

export function collectionKey(src: string): string {
  try { return decodeURIComponent(new URL(src, "https://collection.local").pathname); }
  catch { return src; }
}

export function collectionEntry(src: string, index: number) {
  const credit = COLLECTION_CREDITS[collectionKey(src)] ?? {};
  const kind = isCollectionVideo(src) ? "Motion study" : "Photographic study";
  return { ...credit, src, key: collectionKey(src), kind,
    title: credit.title ?? `${kind} ${String(index + 1).padStart(2, "0")}`,
    alt: credit.alt ?? `Ming Creatives collection, ${kind.toLowerCase()} ${index + 1}` };
}

/** Only public Instagram profiles can become contact links. */
export function instagramProfile(value?: string): string | undefined {
  if (!value) return;
  const handle = value.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/^@/, "").replace(/\/$/, "");
  if (/^[a-zA-Z0-9._]{1,30}$/.test(handle)) return `https://www.instagram.com/${handle}/`;
}
