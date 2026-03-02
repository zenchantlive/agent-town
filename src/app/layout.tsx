import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Town",
  description: "Multi-agent collaboration platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  );
}