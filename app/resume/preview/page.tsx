"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, Download, Printer } from "lucide-react"
import Link from "next/link"
import { ENABLE_PDF_EXPORT } from "@/lib/feature-flags"

type ResumeSection = {
  title: string
  items: Array<{ heading: string; subheading?: string; bullets?: string[] }>
}

export default function ResumePreviewPage() {
  const [json, setJson] = useState<string>("")
  const [error, setError] = useState<string>("")
  const docRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Read draft resume from localStorage placed by chat (future work)
    const saved = localStorage.getItem("adam_resume_draft")
    if (saved) setJson(saved)
  }, [])

  const resume = useMemo(() => {
    if (!json) return null
    try {
      return JSON.parse(json) as { name?: string; email?: string; phone?: string; sections?: ResumeSection[] }
    } catch (e: any) {
      setError("Invalid JSON draft")
      return null
    }
  }, [json])

  async function handleDownload() {
    if (ENABLE_PDF_EXPORT) {
      // Placeholder for future html2canvas + jspdf export
      // Keeping a simple print fallback ensures no dependency changes
    }
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/60 p-3 backdrop-blur">
        <Link href="/wicho" className="text-white/70 hover:text-white inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <Printer size={16} /> Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-4">
        <div className="mb-4">
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            placeholder="Paste or edit resume JSON here (name, contact, sections)"
            className="h-40 w-full rounded-md border border-white/10 bg-black/40 p-2 text-sm outline-none"
          />
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </div>

        <div ref={docRef} className="bg-white p-8 text-black shadow-xl print:shadow-none">
          <header className="border-b border-gray-200 pb-2">
            <h1 className="text-2xl font-bold">{resume?.name ?? "Your Name"}</h1>
            <p className="text-sm text-gray-600">
              {resume?.email ?? "email@example.com"} • {resume?.phone ?? "+1 (555) 555-5555"}
            </p>
          </header>

          <main className="mt-4 space-y-6">
            {(resume?.sections ?? []).map((sec, i) => (
              <section key={i}>
                <h2 className="text-lg font-semibold">{sec.title}</h2>
                <div className="mt-2 space-y-3">
                  {sec.items.map((it, j) => (
                    <div key={j}>
                      <div className="flex items-baseline justify-between">
                        <strong>{it.heading}</strong>
                        <span className="text-xs text-gray-600">{it.subheading}</span>
                      </div>
                      {it.bullets && it.bullets.length > 0 && (
                        <ul className="ml-5 list-disc text-sm text-gray-800">
                          {it.bullets.map((b, k) => (
                            <li key={k}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  )
}



