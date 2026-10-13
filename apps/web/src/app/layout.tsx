import type { Metadata } from "next"
import "./globals.css"

import AppProviders from "@/providers/AppProviders"
import { Inter } from "next/font/google";


export const metadata: Metadata = {
  title: {
    default: "WorkSpace",
    template: "%s | WorkSpace",
  },

  description:
    "A modern web application built with Next.js, React, TypeScript, and Tailwind CSS.",

  applicationName: "WorkSpace",

  authors: [
    {
      name: "JGC Jamero Group of Companies",
    },
  ],

  creator: "JGC Jamero Group of Companies",

  keywords: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Web Application",
  ],

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "WorkSpace",
    description:
      "A modern web application built with Next.js, React, TypeScript, and Tailwind CSS.",
    siteName: "WorkSpace",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "WorkSpace",
    description:
      "A modern web application built with Next.js, React, TypeScript, and Tailwind CSS.",
  },

  robots: {
    index: false,
    follow: false,
  },
};


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}