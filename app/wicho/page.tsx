"use client"

import { useState, useRef } from "react"
import { Send, ArrowLeft, X, Download, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ChatModal {
  id: string
  type: "experience" | "resume" | "project"
  title: string
  content: any
  position: { x: number; y: number }
}

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [lastMessage, setLastMessage] = useState("")
  const [modals, setModals] = useState<ChatModal[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = () => {
    if (!message.trim()) return

    setLastMessage(message)
    setIsTyping(true)

    // Simulate AI response with modals
    setTimeout(() => {
      generateModals(message)
      setIsTyping(false)
      setMessage("")
    }, 2000)
  }

  const generateModals = (userMessage: string) => {
    // Mock modal generation based on message content
    const newModals: ChatModal[] = []

    const positions = [
      { x: 20, y: 80 },
      { x: 20, y: 200 },
      { x: 20, y: 320 },
    ]

    let modalIndex = 0

    if (userMessage.toLowerCase().includes("computer vision") || userMessage.toLowerCase().includes("cv")) {
      newModals.push({
        id: "1",
        type: "experience",
        title: "Computer Vision Experience",
        content: {
          role: "Computer Vision Engineer",
          company: "Tech Corp",
          duration: "2022 - Present",
          description: "Developed advanced computer vision algorithms for robotic perception and autonomous navigation.",
          technologies: ["OpenCV", "PyTorch", "YOLO", "ROS"],
          images: ["/computer-vision-project.png"],
        },
        position: positions[modalIndex++],
      })
    }

    if (userMessage.toLowerCase().includes("resume") || userMessage.toLowerCase().includes("cv")) {
      newModals.push({
        id: "2",
        type: "resume",
        title: "Download Resume",
        content: {
          description: "Complete professional resume with all experience, education, and skills.",
          downloadUrl: "/Adan_Flores_resume.pdf",
          lastUpdated: "January 2025",
        },
        position: positions[modalIndex++],
      })
    }

    if (userMessage.toLowerCase().includes("project") || userMessage.toLowerCase().includes("robotics")) {
      newModals.push({
        id: "3",
        type: "project",
        title: "Robotics Project Showcase",
        content: {
          title: "Autonomous Navigation Robot",
          description:
            "Developed a fully autonomous robot capable of navigation in complex environments using SLAM and computer vision.",
          technologies: ["ROS", "Python", "C++", "OpenCV", "PCL"],
          images: ["/autonomous-robot-navigation.png"],
          demoUrl: "https://youtube.com/watch?v=demo",
        },
        position: positions[modalIndex++],
      })
    }

    setModals(newModals)
  }

  const closeModal = (id: string) => {
    setModals(modals.filter((modal) => modal.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
      {/* Background AI Character */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-96 h-96 md:w-[500px] md:h-[500px] opacity-30">
          <Image src="/futuristic-ai-hologram.png" alt="AI Assistant Character" fill className="object-contain animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
      </div>

      {/* Chat Modals */}
      {modals.map((modal, index) => (
        <div
          key={modal.id}
          className="fixed z-20 animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{
            left: typeof window !== "undefined" && window.innerWidth > 768 ? `${modal.position.x + index * 350}px` : "10px",
            top: typeof window !== "undefined" && window.innerWidth > 768 ? `${modal.position.y}px` : `${80 + index * 200}px`,
            right: typeof window !== "undefined" && window.innerWidth <= 768 ? "10px" : "auto",
          }}
        >
          <div className="bg-[#1a1a1a]/95 backdrop-blur-md border border-purple-500/30 rounded-xl p-6 w-full md:w-80 lg:w-96 shadow-2xl max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{modal.title}</h3>
              <button onClick={() => closeModal(modal.id)} className="text-white/60 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {modal.type === "experience" && (
              <div className="space-y-4">
                {modal.content.images && (
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image src={modal.content.images[0] || "/placeholder.svg"} alt={modal.content.role} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-white">{modal.content.role}</h4>
                  <p className="text-purple-400">{modal.content.company}</p>
                  <p className="text-white/60 text-sm">{modal.content.duration}</p>
                </div>
                <p className="text-white/80 text-sm">{modal.content.description}</p>
                <div className="flex flex-wrap gap-2">
                  {modal.content.technologies.map((tech: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {modal.type === "resume" && (
              <div className="space-y-4">
                <p className="text-white/80 text-sm">{modal.content.description}</p>
                <p className="text-white/60 text-xs">Last updated: {modal.content.lastUpdated}</p>
                <a
                  href={modal.content.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download Resume
                </a>
              </div>
            )}

            {modal.type === "project" && (
              <div className="space-y-4">
                {modal.content.images && (
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image src={modal.content.images[0] || "/placeholder.svg"} alt={modal.content.title} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-white">{modal.content.title}</h4>
                  <p className="text-white/80 text-sm">{modal.content.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {modal.content.technologies.map((tech: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
                {modal.content.demoUrl && (
                  <a
                    href={modal.content.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} />
                    View Demo
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      <Link
        href="/"
        className="fixed top-6 left-6 z-30 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/20"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">Back</span>
      </Link>

      {/* Chat Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-10 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Last Message Display */}
          {lastMessage && (
            <div className="mb-4 p-3 bg-[#1a1a1a]/80 backdrop-blur-md rounded-lg border border-white/10">
              <p className="text-white/80 text-sm">
                <span className="text-white/60">You:</span> {lastMessage}
              </p>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="mb-4 p-3 bg-purple-600/20 backdrop-blur-md rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
                <span className="text-purple-300 text-sm">AI is analyzing your request...</span>
              </div>
            </div>
          )}

          {/* Input Field */}
          <div className="flex gap-3 items-center bg-[#1a1a1a]/90 backdrop-blur-md rounded-full border border-white/20 p-2">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about my experience, request my resume, or inquire about projects..."
              className="flex-1 bg-transparent text-white placeholder-white/50 px-4 py-2 focus:outline-none"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white p-2 rounded-full transition-all duration-300 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Suggested Prompts */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {["Show me your computer vision experience", "I need your resume", "Tell me about your robotics projects"].map(
              (prompt, i) => (
                <button
                  key={i}
                  onClick={() => setMessage(prompt)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs rounded-full transition-all duration-300"
                  disabled={isTyping}
                >
                  {prompt}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


