"use client"

import { useCallback, useState } from "react"

// Type declaration for html2pdf.js
declare module "html2pdf.js"

interface PDFOptions {
  filename?: string
  margin?: number | number[]
  image?: { type: string; quality: number }
  html2canvas?: { scale: number; useCORS: boolean; letterRendering: boolean }
  jsPDF?: { unit: string; format: string; orientation: string }
}

interface UsePDFDownloadOptions {
  filename?: string
  onStart?: () => void
  onComplete?: () => void
  onError?: (error: Error) => void
}

interface UsePDFDownloadReturn {
  download: () => Promise<void>
  downloadWithPrint: () => void
  isDownloading: boolean
  error: Error | null
}

export function usePDFDownload(
  elementRef: React.RefObject<HTMLElement | null>,
  options: UsePDFDownloadOptions = {}
): UsePDFDownloadReturn {
  const { filename = "resume.pdf", onStart, onComplete, onError } = options

  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const download = useCallback(async () => {
    if (!elementRef.current) {
      const err = new Error("Element reference is null")
      setError(err)
      onError?.(err)
      return
    }

    setIsDownloading(true)
    setError(null)
    onStart?.()

    try {
      // Dynamically import html2pdf.js
      const html2pdf = (await import("html2pdf.js")).default

      const pdfOptions: PDFOptions = {
        margin: [0.25, 0.25, 0.25, 0.25],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "in",
          format: "letter",
          orientation: "portrait",
        },
      }

      await html2pdf().set(pdfOptions).from(elementRef.current).save()

      onComplete?.()
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to generate PDF")
      setError(error)
      onError?.(error)
    } finally {
      setIsDownloading(false)
    }
  }, [elementRef, filename, onStart, onComplete, onError])

  const downloadWithPrint = useCallback(() => {
    if (!elementRef.current) {
      const err = new Error("Element reference is null")
      setError(err)
      onError?.(err)
      return
    }

    // Create a new window with just the resume content for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      const err = new Error("Failed to open print window")
      setError(err)
      onError?.(err)
      return
    }

    const content = elementRef.current.outerHTML

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename.replace(".pdf", "")}</title>
          <style>
            @page {
              size: letter;
              margin: 0.5in;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: "Times New Roman", Times, serif;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }, [elementRef, filename, onError])

  return {
    download,
    downloadWithPrint,
    isDownloading,
    error,
  }
}

export default usePDFDownload
