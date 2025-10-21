"use client"

import Image from "next/image"

export default function WaveBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0e0e0e] to-[#1a1a1a] opacity-90" />
      <Image
        src="/images/preview.png"
        alt="Wicho background"
        fill
        className="object-cover opacity-25"
        priority
      />
      <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
    </div>
  )
}


