import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Navi — Money that thinks for you.";
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
            "linear-gradient(135deg, #0a0e1a 0%, #1b2349 42%, #0d3d35 78%, #00e0b8 140%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,224,184,0.35) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(0,224,184,0.15)",
              border: "1px solid rgba(0,224,184,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: "#00e0b8",
            }}
          >
            ✦
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#f5f7fa",
              letterSpacing: "-0.02em",
            }}
          >
            Navi
          </span>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#f5f7fa",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: 900,
            padding: "0 48px",
          }}
        >
          Money that thinks for you.
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 22,
            color: "rgba(160,174,192,0.95)",
            textAlign: "center",
          }}
        >
          AI financial coach for individuals & SMEs in the UAE
        </div>
      </div>
    ),
    { ...size }
  );
}
