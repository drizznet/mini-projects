import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FD366E",
          borderRadius: 8,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
          <path
            d="M9.5 8.5 17.5 16 9.5 23.5"
            stroke="white"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 8.5 24.5 16 16.5 23.5"
            stroke="white"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
