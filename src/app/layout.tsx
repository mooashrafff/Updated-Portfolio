import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { personal } from "@/config/personal";

// Load Inter font for non-Apple devices
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: personal.branding.siteTitle,
  description: personal.branding.siteDescription,
  keywords: personal.branding.keywords,
  authors: [
    {
      name: personal.branding.creatorName,
      url: personal.branding.siteUrl,
    },
  ],
  creator: personal.branding.creatorName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: personal.branding.siteUrl,
    title: personal.branding.siteTitle,
    description: personal.branding.siteDescription,
    siteName: personal.branding.siteTitle,
  },
  twitter: {
    card: "summary_large_image",
    title: personal.branding.siteTitle,
    description: personal.branding.siteDescription,
    creator: personal.branding.twitterHandle,
  },
  icons: {
    icon: [
      {
        url: personal.branding.logoSrc,
        sizes: "any",
      }
    ],
    shortcut: "/favicon.svg?v=2",
    apple: "/apple-touch-icon.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <main className="flex min-h-screen flex-col">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}