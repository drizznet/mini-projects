import { ImageResponse } from "next/og";

import { SocialCard } from "@/components/seo/social-card";

export const alt = "lockIn — Protect your attention";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<SocialCard />, size);
}
