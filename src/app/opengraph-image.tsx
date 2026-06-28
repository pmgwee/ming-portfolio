import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo";

// Branded social-share card (Open Graph + Twitter). Generated at build/request
// time via next/og — no binary asset needed. Default system font keeps the
// build dependency-free; the brand identity comes from the gradient + layout.
export const alt = `${SITE.name} — ${SITE.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          background: "#07080c",
          backgroundImage:
            "radial-gradient(circle at 25% 20%, rgba(99,102,241,0.35), transparent 55%), radial-gradient(circle at 80% 90%, rgba(139,92,246,0.30), transparent 55%)",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "#a5b4fc",
          }}
        >
          {SITE.jobTitle}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 110,
            fontWeight: 700,
            lineHeight: 1.05,
            backgroundImage: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {SITE.name}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 38,
            lineHeight: 1.35,
            color: "#a1a1aa",
            maxWidth: 900,
          }}
        >
          Award-standard 3D animated websites — cinematic, high-performance,
          and AI-powered when you need it.
        </div>
      </div>
    ),
    { ...size },
  );
}
