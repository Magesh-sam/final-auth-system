import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth System",
  description: "A simple authentication system with Next.js",
  manifest: "/manifest.json",
  generator: "v0.dev",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="apple-mobile-web-app-title" content="Auth System" />
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import "./globals.css";
import Providers from "@/components/Providers";
