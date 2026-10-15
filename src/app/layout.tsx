import type { Metadata } from "next";
import "./globals.css";
import { Lobster } from "next/font/google";

const lobster = Lobster({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lobster",
});

export const metadata: Metadata = {
  title: "LaunchPad — From idea to execution",
  description: "AI-assisted project planning and execution workspace.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={lobster.variable}>{children}</body>
    </html>
  );
}
