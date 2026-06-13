import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { APP_URL } from "@/lib/config";
import { SiteHeader } from "@/components/site/site-header";
import { BottomNav } from "@/components/site/bottom-nav";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MeProvider } from "@/components/me/me-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const DESCRIPTION =
  "Live leaderboard, fixtures and stats for our 18-player FIFA World Cup 2026 prediction pool — 104 matches, 1800 AED on the line.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "FIFA World Cup 2026 Prediction League",
    template: "%s · WC26 Pool",
  },
  description: DESCRIPTION,
  applicationName: "WC26 Pool",
  icons: { icon: "/icon.svg" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "WC26 Pool" },
  openGraph: {
    type: "website",
    siteName: "WC26 Pool",
    title: "FIFA World Cup 2026 Prediction League",
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIFA World Cup 2026 Prediction League",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${archivo.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh font-sans antialiased">
        <MeProvider>
          <TooltipProvider delayDuration={150}>
            <SiteHeader />
            <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-5 md:max-w-5xl md:px-6 md:pb-12">
              {children}
            </main>
            <BottomNav />
            <Toaster position="top-center" richColors />
          </TooltipProvider>
        </MeProvider>
      </body>
    </html>
  );
}
