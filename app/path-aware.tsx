"use client"

import { usePathname } from "next/navigation"
import type React from "react"

export default function ClientPathAware({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isChat = pathname === "/wicho"

  if (isChat) {
    // Hide navbar and footer: only render the main content (second child)
    const childrenArray = Array.isArray(children) ? (children as React.ReactNode[]) : [children]
    // Expect structure: [<Navbar />, <main>{children}</main>, <Footer />]
    return <>{childrenArray[1] ?? children}</>
  }

  return <>{children}</>
}


