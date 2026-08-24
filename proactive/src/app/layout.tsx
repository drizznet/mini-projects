import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { BRAND } from "@/lib/brand";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — ${BRAND.headline}`,
    template: `%s — ${BRAND.name}`,
  },
  description: BRAND.description,
};

export const viewport: Viewport = {
  themeColor: "#111114",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // `dark` is set here so the dark-first palette paints before hydration;
    // ThemeSync takes over once the persisted preference is known.
    <html lang="en" className={`dark ${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
