import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Navi — the AI financial coach that thinks before you spend.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #2A1F6E 0%, #4F46FF 45%, #6E56FF 70%, #05060F 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(155,123,255,0.45) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            Navi
          </span>
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: 920,
            padding: "0 48px",
          }}
        >
          Navi — the AI financial coach that thinks before you spend.
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 22,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
          }}
        >
          Built for the UAE · Budget · Save · Invest · Act
        </div>
      </div>
    ),
    { ...size }
  );
}
