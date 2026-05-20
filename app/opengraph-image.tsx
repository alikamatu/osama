import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cairn — A calm place to plan, reflect, and progress.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #16181f 0%, #1d1f2a 60%, #2a1f3a 100%)",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          color: "#e7e8ec",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "#1e2029",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4.5 A11.5 11.5 0 1 1 16 27.5" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="16" cy="16" r="3" fill="#a78bfa" />
            </svg>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>Cairn</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.05, maxWidth: 980 }}>
            A calm place to plan, reflect, and progress.
          </div>
          <div style={{ fontSize: 28, color: "#b6b9c2", maxWidth: 880, lineHeight: 1.4 }}>
            Daily tasks, habit streaks, goal tracking, and an AI assistant that knows your context.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {["#a78bfa", "#5fd0d6", "#f59e6b", "#5fc28a", "#fafaf7"].map((c) => (
              <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
            ))}
            <div style={{ marginLeft: 8, fontSize: 18, color: "#7d808a" }}>5 themes</div>
          </div>
          <div style={{ fontSize: 18, color: "#7d808a" }}>assistant.alikamatu.com</div>
        </div>
      </div>
    ),
    size,
  );
}
