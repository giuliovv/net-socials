import { Inter } from "next/font/google";
import Head from 'next/head';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Net Socials",
  description: "Net Socials is a social tennis club based in London. Our goal is to serve up connections and community.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Net Socials" />
        <meta property="og:description" content="Net Socials is a social tennis club based in London. Our goal is to serve up connections and community." />
        <meta property="og:image" content="/images/logo-black.png" />
        <meta property="og:url" content="https://net-socials.vercel.app" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Your Site Title" />
        <meta name="twitter:description" content="Your site description" />
        <meta name="twitter:image" content="/images/logo-black.png" /> */}

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/logo-black.png" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
