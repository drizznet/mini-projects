import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: BRAND.headline,
  description: BRAND.description,
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
