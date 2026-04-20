import type { Metadata } from "next";
import { Inter, VT323 } from "next/font/google";
import Script from "next/script";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ding Ren — Full-Stack Engineer",
  description:
    "Full-stack engineer studying CS & Engineering at NTU Singapore. Building with AI every day — from data-science pipelines to full-stack web apps and backend systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${vt323.variable}`}>
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-0T4XLW61J9" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-0T4XLW61J9');
        `}</Script>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
