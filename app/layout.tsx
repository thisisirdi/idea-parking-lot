import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Idea Parking Lot",
  description: "A light internal tool for parking, shaping, and revisiting ideas."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

