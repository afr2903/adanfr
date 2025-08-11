"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react"
import { education } from "@/data/education"

export default function EducationSection() {
  return (
    <section className="section bg-[#121212] text-white" id="education">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading">Education</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {education.map((edu) => (
            <EducationCard key={edu.id} education={edu} />
          ))}
        </div>
      </div>
    </section>
  )
}

function EducationCard({ education }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Create an array of images if only a single image is provided
  const images = education.images ? education.images : education.image ? [education.image] : []

  const hasImages = images.length > 0
  const imageCount = images.length

  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % imageCount)
    }
  }

  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1))
    }
  }

  return (
    <>
      <div className="bg-[#1a1a1a] rounded-lg p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#252525] flex items-center justify-center shrink-0">
              {education.logo && (
                <Image
                  src={education.logo || "/placeholder.svg"}
                  alt={education.institution}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center justify-center w-8 h-8 rounded-full border border-[#333] hover:border-primary transition-all duration-200"
              aria-label="View details"
            >
              <Plus className="w-4 h-4 text-white/70 group-hover:text-primary transition-colors" />
            </button>
          </div>

          <div className="flex-1">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#252525] text-xs text-white/70">
                {education.period}
              </span>
            </div>
            <h4 className="text-white/70 text-sm">{education.institution}</h4>
            <h3 className="text-lg font-bold text-white">{education.degree}</h3>
            <p className="text-white/60 mt-2 text-sm">GPA: {education.gpa}</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1a1a1a] text-white max-w-4xl w-full rounded-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#252525] hover:bg-[#333] transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">{education.degree}</h2>

              {hasImages && (
                <div className="mb-8 relative">
                  <div className="relative aspect-video">
                    <Image
                      src={images[currentImageIndex] || "/placeholder.svg"}
                      alt={education.institution}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>

                  {/* Navigation arrows */}
                  {imageCount > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5 text-white" />
                      </button>
                    </>
                  )}

                  {/* Image navigation dots */}
                  {imageCount > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-2 h-2 rounded-full ${i === currentImageIndex ? "bg-primary" : "bg-[#333]"}`}
                          aria-label={`View image ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Description:</h3>
                <div className="space-y-4">
                  {education.description.map((paragraph, i) => (
                    <p key={i} className="text-white/70">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Details:</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-white/50">Institution: </span>
                      <span className="text-white">{education.institution}</span>
                    </div>
                    <div>
                      <span className="text-white/50">Period: </span>
                      <span className="text-white">{education.period}</span>
                    </div>
                    <div>
                      <span className="text-white/50">Location: </span>
                      <span className="text-white">{education.location}</span>
                    </div>
                    <div>
                      <span className="text-white/50">GPA: </span>
                      <span className="text-white">{education.gpa}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Relevant Coursework:</h3>
                  <div className="flex flex-wrap gap-2">
                    {education.coursework.map((course, i) => (
                      <span key={i} className="px-3 py-1 bg-[#252525] rounded-full text-sm text-white/70">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
