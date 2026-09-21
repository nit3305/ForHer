import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "For You — A Little Journey",
  description: "A private collection of memories, made with love.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
