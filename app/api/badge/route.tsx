import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const style = searchParams.get("style") || "dark";
  const size = searchParams.get("size") || "medium";

  const sizes = {
    small: { width: 120, height: 40, fontSize: 10, iconSize: 12 },
    medium: { width: 180, height: 50, fontSize: 12, iconSize: 16 },
    large: { width: 240, height: 65, fontSize: 14, iconSize: 20 },
  };

  const s = sizes[size as keyof typeof sizes] || sizes.medium;

  const isDark = style === "dark";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: isDark ? "#000" : "#fff",
          padding: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            border: isDark ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(34, 197, 94, 0.5)",
            backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)",
          }}
        >
          {/* Checkmark Circle */}
          <div
            style={{
              width: s.iconSize,
              height: s.iconSize,
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: s.iconSize * 0.6,
              fontWeight: "bold",
            }}
          >
            ✓
          </div>
          
          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: s.fontSize,
                fontWeight: 700,
                color: isDark ? "#fff" : "#000",
                lineHeight: 1.2,
              }}
            >
              Verified Human
            </span>
            <span
              style={{
                fontSize: s.fontSize * 0.8,
                color: isDark ? "#888" : "#666",
                lineHeight: 1.2,
              }}
            >
              notarobot.com
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: s.width,
      height: s.height,
    }
  );
}
