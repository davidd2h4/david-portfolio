import { ImageResponse } from "next/og";

export const alt = "DAVID — Independent Creative Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f3f0ea", color: "#171717", padding: "64px 72px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#6b6862" }}>
          <span>Independent Creative Developer</span>
          <span>7 live projects</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 108, lineHeight: 0.92, letterSpacing: -5, fontWeight: 600 }}>
          <span>Design-led development.</span>
          <span style={{ color: "#2f3de6" }}>Built to be experienced.</span>
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700, letterSpacing: -3 }}>
          DAVID<span style={{ color: "#2f3de6" }}>.</span>
        </div>
      </div>
    ),
    size,
  );
}
