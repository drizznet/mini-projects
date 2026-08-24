import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: BRAND.description,
};

export default function HomePage() {
  return <LandingPage />;
}
