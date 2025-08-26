"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Send, ArrowLeft, X, Download, ExternalLink, Mic, MicOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ENABLE_BAML, ENABLE_DYNAMIC_RESUME, ENABLE_SPEECH } from "@/lib/feature-flags"
import type { WichoModal, WichoResponse } from "@/lib/wicho-types"

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
  const [isRecording, setIsRecording] = useState(false)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null as any)

  const handleSendMessage = async () => {
    if (!message.trim()) return
    const userMessage = message
    setLastMessage(userMessage)
    setIsTyping(true)
    setMessage("")

    if (ENABLE_BAML) {
      try {
        const res = await fetch("/api/wicho", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        })
        const data: WichoResponse = await res.json()
        const mapped = mapWichoResponseToChatModals(data)
        setModals(mapped)
        if (ENABLE_SPEECH) speakModals(mapped)
        if (ENABLE_DYNAMIC_RESUME) saveResumeDraft(mapped, userMessage)
      } catch (e) {
        console.error("/api/wicho error", e)
      } finally {
        setIsTyping(false)
      }
    } else {
      // Keep current local mock generation
      setTimeout(() => {
        generateModals(userMessage)
        setIsTyping(false)
      }, 1200)
    }
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
    if (ENABLE_SPEECH) speakModals(newModals)
    if (ENABLE_DYNAMIC_RESUME) saveResumeDraft(newModals, userMessage)
  }

  function mapWichoResponseToChatModals(resp: WichoResponse): ChatModal[] {
    const positions = [
      { x: 20, y: 80 },
      { x: 20, y: 200 },
      { x: 20, y: 320 },
    ]
    let idx = 0
    return (resp.modals || []).slice(0, 3).map((m) => ({
      id: m.id,
      type: (m.type as any) ?? "project",
      title: m.title,
      content: {
        description: Array.isArray(m.body) ? m.body.join("\n") : m.body,
        images: m.images,
        downloadUrl: m.linkHref,
      },
      position: positions[Math.min(idx++, positions.length - 1)],
    }))
  }

  function speakModals(list: ChatModal[]) {
    try {
      const synth = window.speechSynthesis
      if (!synth) return
      const first = list[0]
      const text = first ? `${first.title}. ${typeof first.content?.description === 'string' ? first.content.description : ''}` : 'New results are ready.'
      const utter = new SpeechSynthesisUtterance(text)
      synth.cancel()
      synth.speak(utter)
    } catch {}
  }

  function saveResumeDraft(list: ChatModal[], query: string) {
    try {
      const expBullets: string[] = []
      const projBullets: string[] = []
      for (const m of list) {
        if (m.type === "experience" && typeof m.content?.description === "string") {
          expBullets.push(m.content.description)
        }
        if (m.type === "project" && typeof m.content?.description === "string") {
          projBullets.push(m.content.description)
        }
      }
      const draft = {
        name: "Adán Flores",
        email: "adan@example.com",
        phone: "+1 (408) 312-1647",
        sections: [
          {
            title: "Summary",
            items: [
              {
                heading: "Role Fit Summary",
                subheading: query,
                bullets: ["Tailored summary generated from chat context."],
              },
            ],
          },
          expBullets.length > 0
            ? {
                title: "Experience",
                items: expBullets.map((b) => ({ heading: "Relevant Experience", bullets: [b] })),
              }
            : null,
          projBullets.length > 0
            ? {
                title: "Projects",
                items: projBullets.map((b) => ({ heading: "Relevant Project", bullets: [b] })),
              }
            : null,
        ].filter(Boolean),
      }
      localStorage.setItem("wicho_resume_draft", JSON.stringify(draft))
    } catch {}
  }

  const closeModal = (id: string) => {
    setModals(modals.filter((modal) => modal.id !== id))
  }

  // Speech: use Web Speech API when enabled
  useEffect(() => {
    if (!ENABLE_SPEECH) return
    const SpeechRecognitionImpl = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SpeechRecognitionImpl) return
    const rec: SpeechRecognition = new SpeechRecognitionImpl()
    rec.lang = "en-US"
    rec.continuous = false
    rec.interimResults = true
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let transcript = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript
      }
      setMessage(transcript)
    }
    rec.onend = () => setIsRecording(false)
    recognitionRef.current = rec
    return () => {
      try { rec.stop() } catch {}
    }
  }, [])

  async function toggleRecording() {
    if (!ENABLE_SPEECH) return
    const rec = recognitionRef.current
    if (!rec) return
    if (isRecording) {
      try { rec.stop() } catch {}
      setIsRecording(false)
      return
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      rec.start()
      setIsRecording(true)
    } catch (e) {
      console.error("mic error", e)
    }
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
           <div className="flex gap-2 items-center bg-[#1a1a1a]/90 backdrop-blur-md rounded-full border border-white/20 p-2">
             {ENABLE_SPEECH && (
               <button
                 type="button"
                 onClick={toggleRecording}
                 className={`rounded-full p-2 ${isRecording ? "bg-red-600/70" : "bg-white/10 hover:bg-white/20"}`}
                 aria-label="Toggle voice input"
               >
                 {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
               </button>
             )}
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

           {ENABLE_DYNAMIC_RESUME && (
             <div className="mt-3 flex justify-center">
               <Link
                 href={`/resume/preview?from=wicho`}
                 className="text-xs text-white/70 hover:text-white underline"
               >
                 Preview AI-tailored resume from your last prompt
               </Link>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}


