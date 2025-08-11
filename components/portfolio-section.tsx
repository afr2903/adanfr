"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ExternalLink, Github, Youtube, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { projects } from "@/data/projects"

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedProject, setSelectedProject] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const filteredProjects =
    activeFilter === "All" ? projects : projects.filter((project) => project.category === activeFilter)

  const handleNextImage = (e) => {
    e.stopPropagation()
    if (selectedProject && selectedProject.details && selectedProject.details.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.details.images.length)
    }
  }

  const handlePrevImage = (e) => {
    e.stopPropagation()
    if (selectedProject && selectedProject.details && selectedProject.details.images) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedProject.details.images.length - 1 : prev - 1))
    }
  }

  return (
    <section className="section bg-[#1a1a1a]" id="portfolio">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-heading">My Projects</h2>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {["All", "Robotics", "Software", "Mechatronics"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full transition-colors ${
                  activeFilter === filter ? "bg-primary text-white" : "bg-[#252525] text-white/70 hover:bg-[#333]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-lg hover-lift cursor-pointer"
              onClick={() => {
                setSelectedProject(project)
                setCurrentImageIndex(0)
              }}
            >
              <div className="relative overflow-hidden">
                <div className="aspect-video">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                  <p className="text-white/70 text-sm">{project.category}</p>
                </div>
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="px-5 py-2 bg-primary rounded-full text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    View Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#252525] max-w-5xl w-full rounded-lg relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#333] hover:bg-[#444] transition-colors z-10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6">{selectedProject.title}</h2>

                {selectedProject.details &&
                  selectedProject.details.images &&
                  selectedProject.details.images.length > 0 && (
                    <div className="mb-8 relative">
                      <div className="relative aspect-video">
                        <Image
                          src={selectedProject.details.images[currentImageIndex] || "/placeholder.svg"}
                          alt={selectedProject.title}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>

                      {/* Navigation arrows */}
                      {selectedProject.details.images.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-5 h-5 text-white" />
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-5 h-5 text-white" />
                          </button>
                        </>
                      )}

                      {/* Image navigation dots */}
                      {selectedProject.details.images.length > 1 && (
                        <div className="flex justify-center mt-4 gap-2">
                          {selectedProject.details.images.map((_, i) => (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation()
                                setCurrentImageIndex(i)
                              }}
                              className={`w-3 h-3 rounded-full ${i === currentImageIndex ? "bg-primary" : "bg-[#444]"}`}
                              aria-label={`View image ${i + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Project Description:</h3>
                  <div className="space-y-4">
                    {selectedProject.projectInfo.map((paragraph, i) => (
                      <div key={i} className="text-white/70">
                        {paragraph}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Details:</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-white/50">Client: </span>
                        <span>{selectedProject.client}</span>
                      </div>
                      <div>
                        <span className="text-white/50">Industry: </span>
                        <span>{selectedProject.industry}</span>
                      </div>
                      <div>
                        <span className="text-white/50">Date: </span>
                        <span>{selectedProject.date}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Technologies:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.split(", ").map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-[#333] rounded-full text-sm text-white/70">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedProject.urls && selectedProject.urls.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Additional resources:</h3>
                    <div className="space-y-3">
                      {selectedProject.urls.map((url, i) => (
                        <a
                          key={i}
                          href={url.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          {url.icon.includes("youtube") && <Youtube size={18} />}
                          {url.icon.includes("github") && <Github size={18} />}
                          {url.icon.includes("newspaper") && <FileText size={18} />}
                          {url.name}
                          <ExternalLink size={14} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
