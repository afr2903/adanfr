"use client"

import { useRef } from "react"
import { X, Download, Printer } from "lucide-react"
import Resume from "./Resume"
import { usePDFDownload } from "@/hooks/usePDFDownload"
import type { ResumeData } from "@/types/resume"

interface ResumePreviewModalProps {
  data: ResumeData
  isOpen: boolean
  onClose: () => void
  onDownloadStart?: () => void
  onDownloadComplete?: () => void
}

export default function ResumePreviewModal({
  data,
  isOpen,
  onClose,
  onDownloadStart,
  onDownloadComplete,
}: ResumePreviewModalProps) {
  const resumeRef = useRef<HTMLDivElement>(null)

  const { download, downloadWithPrint, isDownloading } = usePDFDownload(resumeRef, {
    filename: `${data.contact.name.replace(/\s+/g, "_")}_Resume.pdf`,
    onStart: onDownloadStart,
    onComplete: onDownloadComplete,
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-xl border border-white/10 bg-[#121212] text-white shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h2 className="text-lg font-semibold">Resume Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadWithPrint}
              className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              title="Print to PDF"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              onClick={download}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? "Generating..." : "Download PDF"}
            </button>
            <button
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Resume Preview Container */}
        <div className="p-6 overflow-auto max-h-[80vh]">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Resume ref={resumeRef} data={data} />
          </div>
        </div>

        {/* Footer hint */}
        <div className="border-t border-white/10 p-3 text-center">
          <p className="text-xs text-white/40">
            This resume is generated from your conversation context. Download to save as PDF.
          </p>
        </div>
      </div>
    </div>
  )
}
