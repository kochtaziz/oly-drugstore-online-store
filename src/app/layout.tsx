import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oly Drugstore Online Store",
  description:
    "Customer ordering storefront for Oly Drugstore with pickup, delivery, stock visibility, and WhatsApp order handoff.",
  keywords: [
    "Oly Drugstore",
    "Tunisia drugstore",
    "Bizerte store",
    "Tunis store",
    "online ordering",
    "pickup",
    "delivery",
  ],
  openGraph: {
    title: "Oly Drugstore Online Store",
    description:
      "Order everyday products from Oly Drugstore with store-aware stock, pickup, delivery, and WhatsApp confirmation.",
    type: "website",
    locale: "fr_TN",
    siteName: "Oly Drugstore",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
