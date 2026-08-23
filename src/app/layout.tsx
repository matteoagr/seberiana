import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_SHORT,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Élevage familial`,
    template: `%s · ${SITE_NAME_SHORT}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Élevage canin et félin",
  keywords: [
    "élevage Pomsky",
    "élevage Shiba Inu",
    "élevage Teckel",
    "élevage Maine Coon",
    "Domaine Sibérania",
    "chiots disponibles",
    "chatons disponibles",
    "élevage familial France",
  ],
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/brand/logo-512.png", alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/brand/logo-512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/brand/logo-mark.png", type: "image/png" }],
    apple: [{ url: "/brand/logo-512.png" }],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${body.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="bg-domaine grain flex min-h-full flex-col antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
