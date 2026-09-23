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
          background: "#262626",
          borderRadius: 8,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <path
            d="M11.4 14.6V12.1C11.4 9.45 13.45 7.55 16 7.55c2.55 0 4.6 1.9 4.6 4.55v2.5"
            stroke="white"
            strokeWidth="2.35"
            strokeLinecap="round"
          />
          <rect x="9.35" y="14.35" width="13.3" height="11.4" rx="3.1" fill="white" />
          <circle cx="16" cy="19.1" r="1.7" fill="#262626" />
          <rect
            x="15.25"
            y="20.35"
            width="1.5"
            height="2.35"
            rx="0.75"
            fill="#262626"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
