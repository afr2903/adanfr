"use client"

import { useCallback, useState } from "react"

// Type declaration for html2pdf.js
declare module "html2pdf.js"

interface PDFOptions {
  filename?: string
  margin?: number | number[]
  image?: { type: string; quality: number }
  html2canvas?: {
    scale: number
    useCORS: boolean
    letterRendering: boolean
    logging: boolean
    windowWidth?: number
  }
  jsPDF?: { unit: string; format: string; orientation: string }
  pagebreak?: { mode: string[] }
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

// CSS styles for print/PDF that match the LaTeX styling
const getPrintStyles = () => `
  @page {
    size: letter;
    margin: 0;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: "Times New Roman", Times, Georgia, serif;
    -webkit-font-smoothing: antialiased;
  }
`

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
        margin: [0.5, 0.5, 0.5, 0.5], // 0.5 inch margins like LaTeX
        filename,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 3, // Higher scale for better text quality
          useCORS: true,
          letterRendering: true,
          logging: false,
          windowWidth: 816, // 8.5 inches * 96 DPI
        },
        jsPDF: {
          unit: "in",
          format: "letter",
          orientation: "portrait",
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
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

    // Get all stylesheets from the current document
    const styleSheets = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n")
        } catch {
          return ""
        }
      })
      .join("\n")

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename.replace(".pdf", "")}</title>
          <style>
            ${getPrintStyles()}
            ${styleSheets}
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
    }, 500)
  }, [elementRef, filename, onError])

  return {
    download,
    downloadWithPrint,
    isDownloading,
    error,
  }
}

export default usePDFDownload
