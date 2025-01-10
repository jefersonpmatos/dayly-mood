import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// Metadados do site
export const metadata: Metadata = {
  title: "Annual Diary",
  description: "Your personal diary for the year",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Your personal diary for the year" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Annual Diary" />
        <meta
          property="og:description"
          content="Your personal diary for the year"
        />
        <meta property="og:image" content="/images/annual-diary.png" />
        <meta property="og:url" content="https://annualdiary.vercel.app/" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Annual Diary" />
        <meta
          name="twitter:description"
          content="Your personal diary for the year"
        />
        <meta name="twitter:image" content="/images/annual-diary.png" />

        <link rel="icon" href="/favicon.ico" />
        <title>Annual Diary</title>
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
