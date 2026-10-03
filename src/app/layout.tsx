import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXT — Find your way forward",
  description: "A calm place to begin when you are not sure what to do next.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
