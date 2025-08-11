"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react"
import { experiences } from "@/data/experiences"

export default function ExperienceSection() {
  return (
    <section className="section bg-white text-black" id="experience">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading">Experience</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ experience }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Ensure experience.details.images exists and is an array
  const hasImages = experience.details && experience.details.images && experience.details.images.length > 0
  const imageCount = hasImages ? experience.details.images.length : 0

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
      <div className="bg-gray-100 rounded-lg p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shrink-0">
              {experience.logo && (
                <Image
                  src={experience.logo || "/placeholder.svg"}
                  alt={experience.company}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 hover:border-primary transition-all duration-200"
              aria-label="View details"
            >
              <Plus className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
            </button>
          </div>

          <div className="flex-1">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-xs text-gray-700">
                {experience.period}
              </span>
            </div>
            <h4 className="text-gray-700 text-sm">{experience.company}</h4>
            <h3 className="text-lg font-bold text-black">{experience.role}</h3>
            <p className="text-gray-600 mt-2 text-sm">{experience.description}</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-black max-w-4xl w-full rounded-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">{experience.role}</h2>

              {hasImages && (
                <div className="mb-8 relative">
                  <div className="relative aspect-video">
                    <Image
                      src={experience.details.images[currentImageIndex] || "/placeholder.svg"}
                      alt={experience.company}
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
                      {experience.details.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-2 h-2 rounded-full ${i === currentImageIndex ? "bg-primary" : "bg-gray-300"}`}
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
                  {experience.details.description.map((paragraph, i) => (
                    <p key={i} className="text-gray-700">
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
                      <span className="text-gray-500">Organization: </span>
                      <span className="text-black">{experience.details.organization}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Period: </span>
                      <span className="text-black">{experience.details.period}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Location: </span>
                      <span className="text-black">{experience.details.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {experience.details.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700">
                        {skill}
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
