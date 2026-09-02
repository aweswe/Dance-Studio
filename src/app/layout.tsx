import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/utils/constants";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0F0F0F" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
};

const displayFace = Big_Shoulders({
  variable: "--font-display-face",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Dance Classes in Secunderabad | Kids, Adults, Fitness & Kuchipudi | Rhythmzz Academy",
    template: "%s | Rhythmzz Academy of Dance",
  },
  description:
    "Rhythmzz Academy of Dance — dance classes at Neredmet X Road, Secunderabad since 2010. Kids Dance, Adults Dance, Mind & Body Fitness, Kuchipudi Classical. Free trial class. Call +91 90529 80859.",
  keywords: [
    "dance classes Secunderabad",
    "dance classes Neredmet",
    "dance classes Sainikpuri",
    "dance classes AS Rao Nagar",
    "dance classes Yapral",
    "kids dance classes Hyderabad",
    "adults dance classes Hyderabad",
    "Zumba classes Secunderabad",
    "Kuchipudi classes Secunderabad",
    "fitness classes Neredmet",
    "Bollywood dance Secunderabad",
    "Hip Hop dance classes Hyderabad",
    "dance academy Secunderabad",
    "dance studio Hyderabad",
    "Rhythmzz Academy of Dance",
  ],
  authors: [{ name: "Rhythmzz Academy of Dance" }],
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Rhythmzz Academy of Dance",
    title:
      "Rhythmzz Academy of Dance | Dance & Fitness Classes in Secunderabad",
    description:
      "Dance and fitness classes at Neredmet X Road, Secunderabad — Kids Dance, Adults Dance, Mind & Body Fitness, Kuchipudi Classical. Free trial class. +91 90529 80859.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rhythmzz Academy of Dance — Dance Classes in Secunderabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Rhythmzz Academy of Dance | Dance & Fitness Classes in Secunderabad",
    description:
      "Kids Dance, Adults Dance, Mind & Body Fitness, Kuchipudi Classical near Neredmet X Road, Secunderabad. Free trial. +91 90529 80859.",
    images: ["/og-image.jpg"],
  },
  other: {
    "geo.region": "IN-TG",
    "geo.placename": "Secunderabad, Hyderabad, Telangana",
    "geo.position": "17.4431;78.5032",
    ICBM: "17.4431, 78.5032",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png" }],
  },
  manifest: "/manifest.json",
};

import { ThemeInitializer } from "@/components/shared/theme-initializer";
import { NavigationProgress } from "@/components/shared/navigation-progress";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`dark ${displayFace.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('rhythmzz-theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}else{document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-body">
        <NavigationProgress />
        <ThemeInitializer />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
