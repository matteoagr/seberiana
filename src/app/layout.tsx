import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
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
  title: {
    default: "Domaine Sibérania — Élevage familial",
    template: "%s · Sibérania",
  },
  description:
    "Pomsky, Shiba Inu, Teckel et Maine Coon au Domaine Sibérania. Annuaire des disponibilités, portées suivies et élevage familial.",
  metadataBase: new URL("https://siberiana.fr"),
  openGraph: {
    title: "Domaine Sibérania",
    description:
      "Un élevage familial où chiens et chats grandissent entourés de soin et de transparence.",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/brand/logo-512.png" }],
  },
  icons: {
    icon: [{ url: "/brand/logo-mark.png", type: "image/png" }],
    apple: [{ url: "/brand/logo-512.png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} h-full`}>
      <body className="bg-domaine grain min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
