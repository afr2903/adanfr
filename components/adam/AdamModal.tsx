"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react"
import type { AdamModal as TAdamModal } from "@/types/adam"

interface Props {
  modal: TAdamModal
  onClose: () => void
}

function ImageCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  if (images.length === 1) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image src={images[0]} alt="modal image" fill className="object-cover" />
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1} of ${images.length}`}
          fill
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        aria-label="Next image"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function AdamModal({ modal, onClose }: Props) {
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
            <ImageCarousel images={modal.images} />
          )}
        </div>
      </div>
    </div>
  )
}


