"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import Image from "next/image"

interface ExperienceProps {
  logo: string
  company: string
  role: string
  period: string
  description: string
  details: {
    description: string[]
    organization: string
    period: string
    location: string
    skills: string[]
    images?: string[]
  }
}

export default function ExperienceCard({ experience }: { experience: ExperienceProps }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative mb-6">
      <div className="bg-[#1a1a1a] rounded-lg p-6 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#252525] flex items-center justify-center">
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
            <div>
              <div className="text-sm text-[#a8a8a8] mb-1">
                <span className="inline-block px-3 py-1 rounded-full bg-[#252525] text-xs">{experience.period}</span>
              </div>
              <h3 className="text-[#a8a8a8] text-lg font-medium">{experience.company}</h3>
              <h4 className="text-white text-xl font-bold">{experience.role}</h4>
              <p className="text-[#a8a8a8] mt-2">{experience.description}</p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#333] hover:border-white transition-all duration-200"
            aria-label="View details"
          >
            <Plus className="w-4 h-4 text-[#a8a8a8] group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1a1a1a] max-w-4xl w-full rounded-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#252525] hover:bg-[#333] transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">{experience.role}</h2>

              {experience.details.images && experience.details.images.length > 0 && (
                <div className="mb-8">
                  <Image
                    src={experience.details.images[0] || "/placeholder.svg"}
                    alt={experience.company}
                    width={800}
                    height={400}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-medium text-white mb-2">Description:</h3>
                <div className="space-y-4">
                  {experience.details.description.map((paragraph, i) => (
                    <p key={i} className="text-[#a8a8a8]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Details:</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[#a8a8a8]">Organization: </span>
                      <span className="text-white">{experience.details.organization}</span>
                    </div>
                    <div>
                      <span className="text-[#a8a8a8]">Period: </span>
                      <span className="text-white">{experience.details.period}</span>
                    </div>
                    <div>
                      <span className="text-[#a8a8a8]">Location: </span>
                      <span className="text-white">{experience.details.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {experience.details.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-[#252525] rounded-full text-sm text-[#a8a8a8]">
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
    </div>
  )
}
