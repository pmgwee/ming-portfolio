import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Gwee Per Ming, Production AI Builder and Creative Technologist. Ming Creatives studio identity.";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 78px",
          background: "#07080c",
          color: "#f4f4f5",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderLeft: "12px solid #818cf8",
            paddingLeft: 20,
            color: "#c7d2fe",
            fontSize: 24,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {SITE.studioName}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.02,
            }}
          >
            {SITE.personName}
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#d4d4d8" }}>
            Production AI Builder · Creative Technologist
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#a1a1aa" }}>
          AI systems · Software · 3D web studio · {SITE.location}
        </div>
      </div>
    ),
    size,
  );
}
