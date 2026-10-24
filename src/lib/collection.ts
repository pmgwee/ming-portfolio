/** Public editorial titles and verified credits. Keys are decoded media paths, not signed URLs.
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
  poster?: string;
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

// Editorial titles describe each frame's mood; locations and talent stay in
// the verified credits below. Keys remain stable when the gallery is reordered.
const PHOTO_TITLES: Record<string, string> = {
  "candice 1.1.webp": "City in Her Stride",
  "candice 1.2.webp": "Within Reach",
  "candice 1.3.webp": "Between Departures",
  "candice 1.4.webp": "Her Own Frequency",
  "crystal 1.1.webp": "Botanical Reverie",
  "crystal 1.2.webp": "Through the Veil",
  "crystal 1.3.webp": "In the Garden's Keeping",
  "jasper 1.1.webp": "Between Snow and Sky",
  "jasper 1.2.webp": "Winter in Profile",
  "juyi 1.webp": "A Little Daydream",
  "juyi 2.webp": "Where the Light Settles",
  "juyi 3.webp": "Through the Green",
  "juyi 4.webp": "Sun on Her Side",
  "juyi 5.webp": "Love, All",
  "juyi 6.webp": "After the Match",
  "miami.webp": "A Toast to Havana",
  "ming 1.1.webp": "After Hours, Georgetown",
  "ming 1.2.webp": "The Green Room",
  "ming 1.3.webp": "Breaking the Fourth Wall",
  "ming 2.1.webp": "Light Takes a Turn",
  "ming 2.2.webp": "Above the Street",
  "ming 2.3.webp": "Leaning into Night",
  "ming 2.4.webp": "A Different Angle",
  "ming 3.1.webp": "Midnight in Turquoise",
  "ming 3.2.webp": "Orange-Tinted Mischief",
  "ming 3.3.webp": "The City Can Wait",
  "sakura.webp": "Beneath a Blushing Sky",
  "sayaha 1.1.webp": "Flowers for the Afternoon",
  "sayaha 1.2.webp": "A Turn in the Garden",
  "sayaha 1.3.webp": "Petals in Motion",
  "sayaha 1.4.webp": "The Long Way Through",
  "slyvia 1.1.webp": "Rain, Reflected",
  "slyvia 1.2.webp": "One Light in the Rain",
  "slyvia 1.3.webp": "Through a Thousand Drops",
  "slyvia 1.4.webp": "Shelter in the Storm",
  "slyvia 1.5.webp": "The Rain Stays Close",
  "tayar 1.1.webp": "Old Streets, New Stories",
  "tayar 1.2.webp": "Meet Me at the Corner",
  "tayar 1.3.webp": "Cover Story",
  "wat 1.1.webp": "Under the Aurora",
  "yiwei 1.1.webp": "A Pause on the Street",
  "yiwei 1.2.webp": "Life Between Errands",
  "zhan hang 1.webp": "The Next Chapter",
  "zhan hang1.2.webp": "Beyond the Lecture Hall",
};

// Motion titles reviewed against the films, including the separate carousel.
const FILM_CREDITS: Record<string, CollectionCredit> = {
  "/showcase-films/01-autumn-at-fuji.mp4": {
    title: "Autumn at Fuji",
    alt: "A couple looks out across a lake toward snow-capped Mount Fuji, framed by red maple leaves.",
  },
  "/showcase-films/02-night-drive.mp4": {
    title: "Night Drive",
    alt: "A man speaks to camera beside a car on a quiet Kuala Lumpur street at night.",
  },
  "/temp_pictures/bali trip.mp4": {
    title: "Where the Tide Takes Us",
    poster: "/collection-posters/where-the-tide-takes-us.webp",
    alt: "A figure walks along the shore as waves roll in beneath a pastel sunset.",
  },
  "/temp_pictures/firework 2.0.mp4": {
    title: "A Sky Full of Sparks",
    poster: "/collection-posters/a-sky-full-of-sparks.webp",
    alt: "Colorful fireworks burst above a brightly illuminated building at night.",
  },
  "/temp_pictures/firework.mp4": {
    title: "Watching the Night Bloom",
    poster: "/collection-posters/watching-the-night-bloom.webp",
    alt: "Two people watch fireworks together beneath a glowing light.",
  },
  "/temp_pictures/iris shooting.mp4": {
    title: "Onward, Together",
    poster: "/collection-posters/onward-together.webp",
    alt: "Graduates in purple gowns walk and leap along a sunlit, tree-lined path.",
  },
  "/temp_pictures/johor home moon.mp4": {
    title: "The Way It Used to Be",
    poster: "/collection-posters/the-way-it-used-to-be.webp",
    alt: "Quiet indoor scenes move from a person lying with a phone to a sunlit window and a silhouette.",
  },
  "/temp_pictures/sakura .mp4": {
    title: "Moon in Full Bloom",
    poster: "/collection-posters/moon-in-full-bloom.webp",
    alt: "Pale cherry blossoms surround a glowing street lantern against the night sky.",
  },
  "/video/Basketball Animation.mp4": {
    title: "Flight of the Game",
    alt: "An animated basketball floats and spins through outdoor basketball courts.",
  },
  "/video/Launching Motion Video.mp4": {
    title: "SemuaSini, in Motion",
    alt: "A motion design film introduces subscription tracking, AI usage, and Telegram reminders for SemuaSini.",
  },
  "/video/Short Film.mp4": {
    title: "Before the Light Leaves",
    alt: "A figure moves along a beach while the sunset lights the waves in orange and gold.",
  },
  "/video/Startup company trailer.mp4": {
    title: "GOO.ai: A New Perspective",
    alt: "A cinematic camera move through an old stone street leads to a GOO.ai brand reveal.",
  },
};

// Series and credits supplied by the creator. Explicit membership keeps separate shoots
// with the same talent distinct and makes every photo in a series consistent.
const PHOTO_SERIES = [
  { location: "Pasar Seni, Kuala Lumpur", talent: "Candice", files: ["candice 1.1.webp", "candice 1.2.webp", "candice 1.3.webp", "candice 1.4.webp"] },
  { location: "Botanical Garden, Penang", talent: "Crystal", files: ["crystal 1.1.webp", "crystal 1.2.webp", "crystal 1.3.webp"] },
  { location: "Tennessee, USA (Abroad)", talent: "Jasper", files: ["jasper 1.1.webp", "jasper 1.2.webp"] },
  { location: "Campus lake, Penang", talent: "Juyi", files: ["juyi 1.webp", "juyi 2.webp", "juyi 3.webp"] },
  { location: "Tennis court, Penang", talent: "Juyi", files: ["juyi 4.webp", "juyi 5.webp", "juyi 6.webp"] },
  { location: "Little Havana, Miami (Abroad)", talent: "Ming Creatives", files: ["miami.webp"] },
  { location: "Georgetown, Penang", talent: "Ming Creatives", files: ["ming 1.1.webp", "ming 1.2.webp", "ming 1.3.webp", "ming 2.1.webp", "ming 2.2.webp", "ming 2.3.webp", "ming 2.4.webp"] },
  { location: "Bukit Bintang, Kuala Lumpur", talent: "Ming Creatives", files: ["ming 3.1.webp", "ming 3.2.webp", "ming 3.3.webp"] },
  { location: "Little Havana, Washington DC (Abroad)", talent: "Ming Creatives", files: ["sakura.webp"] },
  { location: "Botanical Garden, Penang", talent: "Sayaha", files: ["sayaha 1.1.webp", "sayaha 1.2.webp", "sayaha 1.3.webp", "sayaha 1.4.webp"] },
  { location: "Secret place, Kuala Lumpur", talent: "Slyvia", files: ["slyvia 1.1.webp", "slyvia 1.2.webp", "slyvia 1.3.webp", "slyvia 1.4.webp", "slyvia 1.5.webp"] },
  { location: "Georgetown, Penang", talent: "Tayar", files: ["tayar 1.1.webp", "tayar 1.2.webp", "tayar 1.3.webp"] },
  { location: "Secret place, Alaska (Abroad)", talent: "Ming Creatives", files: ["wat 1.1.webp"] },
  { location: "Georgetown, Penang", talent: "Yiwei", files: ["yiwei 1.1.webp", "yiwei 1.2.webp"] },
  { location: "University campus, Penang", talent: "Zhanhang", files: ["zhan hang 1.webp", "zhan hang1.2.webp"] },
];

const PHOTO_CREDITS: Record<string, CollectionCredit> = Object.fromEntries(
  PHOTO_SERIES.flatMap(({ location, talent, files }) =>
    files.map(file => [file, { location, model: { name: talent } }]),
  ),
);

export const COLLECTION_CREDITS: Record<string, CollectionCredit> = {
  ...Object.fromEntries(
    [...new Set([...Object.keys(PHOTO_DESCRIPTIONS), ...Object.keys(PHOTO_CREDITS), ...Object.keys(PHOTO_TITLES)])].map(file => [
      `/temp_pictures/${file}`,
      { title: PHOTO_TITLES[file], alt: PHOTO_DESCRIPTIONS[file], ...PHOTO_CREDITS[file] },
    ]),
  ),
  ...FILM_CREDITS,
};

export const isCollectionVideo = (src: string) => /\.(mp4|webm|mov|m4v)(?:\?|$)/i.test(src);

export function collectionKey(src: string): string {
  try { return decodeURIComponent(new URL(src, "https://collection.local").pathname); }
  catch { return src; }
}

export function collectionEntry(src: string, index: number) {
  const credit = COLLECTION_CREDITS[collectionKey(src)] ?? {};
  const kind = isCollectionVideo(src) ? "Motion study" : "Photographic study";
  const filenameTitle = collectionKey(src).split("/").pop()
    ?.replace(/\.[^.]+$/, "").replace(/^\d+[-_\s]*/, "").replace(/[-_]+/g, " ").trim();
  return { ...credit, src, key: collectionKey(src), kind,
    title: credit.title ?? (filenameTitle || kind),
    alt: credit.alt ?? `Ming Creatives collection, ${kind.toLowerCase()} ${index + 1}` };
}

/** Only public Instagram profiles can become contact links. */
export function instagramProfile(value?: string): string | undefined {
  if (!value) return;
  const handle = value.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/^@/, "").replace(/\/$/, "");
  if (/^[a-zA-Z0-9._]{1,30}$/.test(handle)) return `https://www.instagram.com/${handle}/`;
}
