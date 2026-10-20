import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

// Frames selected from contact sheets for a clear subject and readable light,
// avoiding fades, motion blur and empty opening/closing frames.
const frames = [
  { file: "bali trip.mp4", name: "where-the-tide-takes-us", at: 2.4 },
  { file: "firework 2.0.mp4", name: "a-sky-full-of-sparks", at: 0.75 },
  { file: "firework.mp4", name: "watching-the-night-bloom", at: 4.5 },
  { file: "iris shooting.mp4", name: "onward-together", at: 4.35 },
  { file: "johor home moon.mp4", name: "the-way-it-used-to-be", at: 0.18 },
  { file: "sakura .mp4", name: "moon-in-full-bloom", at: 2.2 },
];

if (existsSync(".env")) process.loadEnvFile(".env");
const base = process.env.NEXT_PUBLIC_MEDIA_BASE;
if (!base) throw new Error("Set NEXT_PUBLIC_MEDIA_BASE before generating collection posters.");
const destination = resolve("public/collection-posters");
mkdirSync(destination, { recursive: true });

for (const { file, name, at } of frames) {
  const source = new URL(`temp_pictures/${encodeURIComponent(file)}`, `${base.replace(/\/+$/, "")}/`);
  execFileSync("ffmpeg", [
    "-v", "error", "-ss", String(at), "-i", source.href,
    "-frames:v", "1", "-an", "-map_metadata", "-1", "-vf", "scale=640:-2",
    "-c:v", "libwebp", "-quality", "82", "-compression_level", "6",
    "-y", resolve(destination, `${name}.webp`),
  ], { stdio: "inherit", timeout: 45000 });
  console.log(`Generated ${name}.webp (${at}s)`);
}
