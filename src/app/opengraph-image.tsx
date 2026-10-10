import { ImageResponse } from "next/og"

export const alt = "David — Web Developer & Digital Designer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

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
          backgroundColor: "#08090B",
          color: "#E8E6E1",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 18,
            letterSpacing: 6,
            color: "#9C9890",
          }}
        >
          INDEPENDENT WEB DEVELOPER
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 128,
              lineHeight: 0.9,
              letterSpacing: -4,
            }}
          >
            DAVID
            <span style={{ color: "#8EA6BB" }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 36,
              color: "#C8C4BB",
            }}
          >
            Web Developer & Digital Designer
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
