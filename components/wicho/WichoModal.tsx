"use client"

import Image from "next/image"
import { X, Download } from "lucide-react"
import type { WichoModal as TWichoModal } from "@/types/wicho"

interface Props {
  modal: TWichoModal
  onClose: () => void
}

export default function WichoModal({ modal, onClose }: Props) {
  const isResume = modal.type === "resume"
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4">
      <div className="relative w-full max-w-3xl rounded-xl border border-white/10 bg-[#121212] text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-bold">{modal.title}</h3>
            {isResume && modal.linkHref && (
              <a
                href={modal.linkHref}
                download
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                <Download className="h-4 w-4" /> {modal.linkLabel ?? "Download"}
              </a>
            )}
          </div>

          {Array.isArray(modal.body) ? (
            <div className="space-y-3 text-white/80">
              {modal.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : (
            <p className="text-white/80">{modal.body}</p>
          )}

          {modal.images && modal.images.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {modal.images.map((src, i) => (
                <div key={i} className="relative aspect-video overflow-hidden rounded-lg">
                  <Image src={src} alt="modal image" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


