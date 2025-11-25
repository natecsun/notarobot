import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const score = searchParams.get("score") || "0";
  const accuracy = searchParams.get("accuracy") || "0";
  const streak = searchParams.get("streak") || "0";
  const type = searchParams.get("type") || "game"; // game, resume, profile

  // Different card types
  if (type === "game") {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000",
            backgroundImage: "radial-gradient(circle at 50% 0%, #1a1a1a, #000)",
          }}
        >
          {/* Scan lines effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
            }}
          />
          
          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(255, 51, 51, 0.3)",
                backgroundColor: "rgba(255, 51, 51, 0.1)",
                color: "#FF3333",
                fontSize: 14,
                fontFamily: "monospace",
                marginBottom: 24,
              }}
            >
              🧠 HUMANITY VERIFIED
            </div>

            {/* Score */}
            <div
              style={{
                fontSize: 120,
                fontWeight: 900,
                color: "#FF3333",
                lineHeight: 1,
                fontFamily: "monospace",
              }}
            >
              {score}
            </div>
            <div
              style={{
                fontSize: 24,
                color: "#666",
                marginTop: 8,
                fontFamily: "monospace",
              }}
            >
              POINTS
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: 48,
                marginTop: 40,
              }}
            >
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#fff" }}>{accuracy}%</div>
                <div style={{ fontSize: 14, color: "#666", fontFamily: "monospace" }}>ACCURACY</div>
              </div>
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#fff" }}>{streak}x</div>
                <div style={{ fontSize: 14, color: "#666", fontFamily: "monospace" }}>BEST STREAK</div>
              </div>
            </div>

            {/* CTA */}
            <div
              style={{
                marginTop: 48,
                fontSize: 18,
                color: "#888",
              }}
            >
              Can you beat my score?
            </div>

            {/* Logo */}
            <div
              style={{
                position: "absolute",
                bottom: 40,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>
                NOTAROBOT.COM
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // Resume verification card
  if (type === "resume") {
    const humanScore = searchParams.get("humanScore") || "0";
    
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000",
            backgroundImage: "radial-gradient(circle at 50% 0%, #1a1a1a, #000)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Verified Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 24px",
                borderRadius: "999px",
                border: "2px solid #22c55e",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                color: "#22c55e",
                fontSize: 18,
                fontFamily: "monospace",
                marginBottom: 32,
              }}
            >
              ✓ NOTAROBOT VERIFIED™
            </div>

            {/* Score */}
            <div
              style={{
                fontSize: 140,
                fontWeight: 900,
                color: "#22c55e",
                lineHeight: 1,
              }}
            >
              {humanScore}%
            </div>
            <div
              style={{
                fontSize: 28,
                color: "#888",
                marginTop: 16,
              }}
            >
              Human Authenticity Score
            </div>

            {/* Message */}
            <div
              style={{
                marginTop: 40,
                fontSize: 20,
                color: "#666",
                fontFamily: "monospace",
              }}
            >
              This resume was verified as human-written
            </div>

            {/* Logo */}
            <div
              style={{
                position: "absolute",
                bottom: 40,
                fontSize: 24,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "monospace",
              }}
            >
              NOTAROBOT.COM
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // Default NotARobot card
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 900, color: "#FF3333" }}>
          NOTAROBOT.COM
        </div>
        <div style={{ fontSize: 28, color: "#666", marginTop: 16 }}>
          Prove You're Not One of Them
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
