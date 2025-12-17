"use client"

import { usePathname } from "next/navigation"
import type React from "react"

export default function ClientPathAware({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isChat = pathname === "/adam"

  if (isChat) {
    // Hide navbar and footer: only render the main content (second child)
    // The Layout structure is [<Navbar />, <main>{children}</main>, <Footer />]
    // We want to find the <main> element or just render children directly if the structure is different
    const childrenArray = Array.isArray(children) ? (children as React.ReactNode[]) : [children]
    // Try to find the main content. In the layout.tsx, it's the second child. 
    // If we can't be sure, we might need a more robust way, but for now assuming the Layout structure holds:
    return <>{childrenArray[1] ?? children}</>
  }

  return <>{children}</>
}


