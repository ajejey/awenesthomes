import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AuthProvider } from "./components/AuthProvider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://awenesthomes.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AweNestHomes — Luxury Vacation Rentals & Holiday Homes",
    template: "%s | AweNestHomes",
  },
  description:
    "Discover unique vacation rentals, holiday homes, and luxury stays across India. Book directly with verified hosts for an unforgettable experience.",
  keywords: [
    "vacation rental",
    "holiday homes",
    "luxury stays",
    "short term rental",
    "book direct",
    "villas india",
    "holiday homes india",
    "AweNestHomes",
  ],
  authors: [{ name: "AweNestHomes", url: BASE_URL }],
  creator: "AweNestHomes",
  openGraph: {
    type: "website",
    siteName: "AweNestHomes",
    title: "AweNestHomes — Luxury Vacation Rentals & Holiday Homes",
    description:
      "Discover unique vacation rentals, holiday homes, and luxury stays across India. Book directly with verified hosts.",
    url: BASE_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AweNestHomes — Luxury Vacation Rentals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AweNestHomes — Luxury Vacation Rentals & Holiday Homes",
    description:
      "Discover unique vacation rentals, holiday homes, and luxury stays across India.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/awenest-homes-logo-short.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AweNestHomes",
  url: BASE_URL,
  logo: `${BASE_URL}/awenest-homes-logo-short.png`,
  description:
    "Luxury vacation rentals and holiday homes across India. Book directly with verified hosts.",
  sameAs: [] as string[],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AweNestHomes",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?location={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.className}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
