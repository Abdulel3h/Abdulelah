import { ImageResponse } from "next/og";

export const alt = "Abdulelah Alkhathami — builder of intelligent products";
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
          justifyContent: "space-between",
          background: "#0a0a0b",
          padding: "76px",
          color: "#f2efe7",
          fontFamily: "Georgia, serif"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "#c9a75c"
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <svg width="58" height="50" viewBox="0 0 48 42" fill="none">
            <g
              stroke="#c9a75c"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 37 L14 6 L24 37" />
              <path d="M24 37 L34 6 L44 37" />
              <path d="M8 25 H20" />
              <path d="M28 25 H40" />
            </g>
          </svg>
          <div
            style={{
              fontSize: "26px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#aca79b",
              fontFamily: "sans-serif"
            }}
          >
            Abdulelah Alkhathami
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
          <div style={{ fontSize: "88px", lineHeight: 1.04, fontWeight: 600 }}>
            I build intelligent products.
          </div>
          <div
            style={{
              fontSize: "30px",
              color: "#aca79b",
              maxWidth: "880px",
              lineHeight: 1.4,
              fontFamily: "sans-serif"
            }}
          >
            Software, AI, and considered design — turning real problems into
            systems people actually use.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "24px",
            color: "#aca79b",
            fontFamily: "sans-serif"
          }}
        >
          <div>7 products · GitHub-backed · Riyadh</div>
          <div style={{ color: "#c9a75c" }}>abdulelah.de</div>
        </div>
      </div>
    ),
    size
  );
}
