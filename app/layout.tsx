import type React from "react"
import type { Metadata } from "next"
import { Figtree, DM_Sans } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ClientPathAware from "@/app/path-aware"
import { Analytics } from "@vercel/analytics/next"

const figtree = Figtree({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
})

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Adán Flores | Robotics & AI Engineer",
  description:
    "Personal portfolio of Adán Flores, a Robotics and AI Engineer specializing in research and development.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Favicon and icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${figtree.variable} ${dmSans.variable} bg-[#1f1f1f] text-white`}>
        <ClientPathAware>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ClientPathAware>
        <Analytics />
      </body>
    </html>
  )
}
