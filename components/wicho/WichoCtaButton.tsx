"use client"

import Link from "next/link"
import { Rocket } from "lucide-react"

export default function WichoCtaButton() {
  return (
    <Link
      href="/wicho"
      className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-purple-600 px-6 py-3 text-white shadow-lg transition hover:opacity-95"
    >
      <span className="absolute inset-0 -z-10 animate-pulse rounded-full bg-primary/30 blur-xl" />
      <Rocket className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
      Chat with Wicho
    </Link>
  )
}


