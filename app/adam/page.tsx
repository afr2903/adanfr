"use client"

import { useEffect, useRef, useState } from "react"
import { Send, ArrowLeft, X, Download, ExternalLink, Mic, MicOff, RotateCcw, Sparkles, Github, Youtube, FileText, Globe, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ENABLE_BAML, ENABLE_DYNAMIC_RESUME, ENABLE_SPEECH } from "@/lib/feature-flags"
import type { AdamResponse, LensType } from "@/lib/adam-types"
import { LENS_CONTEXTS } from "@/lib/adam-types"

// --- Types ---

interface ChatModal {
  id: string
  type: "experience" | "resume" | "project" | "summary" | "education"
  title?: string
  content: any
  reasoning?: string | null
}

const LENS_LABELS: Record<LensType, string> = {
  none: 'All',
  recruiter: 'Recruiter',
  collaborator: 'Collaborator',
  researcher: 'Researcher',
  founder: 'Founder'
}

interface ConversationEntry {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const STORAGE_KEY = 'adam_conversation_history'

export default function ChatPage() {
  // --- State ---
  const [message, setMessage] = useState("")
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([])
  const [modals, setModals] = useState<ChatModal[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [activeLens, setActiveLens] = useState<LensType>('none')
  const [isRecording, setIsRecording] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null as any)

  // --- Effects ---
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        setConversationHistory(JSON.parse(stored))
      }
    } catch { }
  }, [])

  useEffect(() => {
    if (isSidebarOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [conversationHistory, isSidebarOpen])

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
      try { rec.stop() } catch { }
    }
  }, [])

  // --- Functions ---
  const saveHistory = (history: ConversationEntry[]) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch { }
  }

  const clearConversation = () => {
    setConversationHistory([])
    setModals([])
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch { }
  }

  const getHistoryForAPI = (): string[] => {
    return conversationHistory.map(entry => entry.content)
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return
    const userMessage = message
    setIsTyping(true)
    setMessage("")

    const lensContext = LENS_CONTEXTS[activeLens]
    const messageWithLens = lensContext ? `${lensContext}\n${userMessage}` : userMessage

    const userEntry: ConversationEntry = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    }
    const updatedHistory = [...conversationHistory, userEntry]
    setConversationHistory(updatedHistory)

    if (ENABLE_BAML) {
      try {
        const res = await fetch("/api/adam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: messageWithLens,
            history: getHistoryForAPI() // API receives all, UI filters display
          }),
        })
        const data: AdamResponse = await res.json()
        const mapped = mapAdamResponseToChatModals(data)

        setModals(prev => [...mapped, ...prev])

        const assistantSummary = mapped.map(m => m.title).join(', ')
        // We track assistant messages for history context but will hide them in UI
        const assistantEntry: ConversationEntry = {
          role: 'assistant',
          content: `Results: ${assistantSummary}`,
          timestamp: Date.now()
        }
        const finalHistory = [...updatedHistory, assistantEntry]
        setConversationHistory(finalHistory)
        saveHistory(finalHistory)

        if (ENABLE_SPEECH) speakModals(mapped)
        if (ENABLE_DYNAMIC_RESUME) saveResumeDraft(mapped, userMessage)
      } catch (e) {
        console.error("/api/adam error", e)
      } finally {
        setIsTyping(false)
      }
    } else {
      setTimeout(() => {
        generateModals(userMessage)
        setIsTyping(false)
      }, 1200)
    }
  }

  const generateModals = (userMessage: string) => {
    const newModals: ChatModal[] = []

    if (userMessage.toLowerCase().includes("vision")) {
      newModals.push({
        id: Date.now() + "-1",
        type: "experience",
        title: "Computer Vision Experience",
        content: {
          role: "Computer Vision Engineer",
          company: "Tech Corp",
          duration: "2022 - Present",
          description: "Developed advanced computer vision algorithms for robotic perception and autonomous navigation.",
          technologies: ["OpenCV", "PyTorch", "YOLO", "ROS"],
          images: ["/computer-vision-project.png"],
          urls: [{ name: "Paper", icon: "newspaper", link: "#" }]
        },
        reasoning: "Matched 'vision' keyword."
      })
    }

    // Summary Modal (Simplified)
    newModals.push({
      id: Date.now() + "-sum",
      type: "summary",
      // No Title for summary
      content: {
        description: "I've pulled up relevant experience in Computer Vision based on your request. Feel free to ask about specific projects."
      },
      // No Reasoning for summary
    })

    setModals(prev => [...newModals, ...prev])
    if (ENABLE_SPEECH) speakModals(newModals)
    if (ENABLE_DYNAMIC_RESUME) saveResumeDraft(newModals, userMessage)
  }

  function mapAdamResponseToChatModals(resp: AdamResponse): ChatModal[] {
    return (resp.modals || []).map((m) => ({
      id: m.id,
      type: (m.type?.toLowerCase() as any) ?? "project",
      title: m.title,
      content: {
        description: Array.isArray(m.body) ? m.body.join("\n") : m.body,
        images: m.images || [],
        downloadUrl: m.linkHref,
        technologies: [], // Frontend expects tech to be populated if available
        urls: m.linkHref ? [{ name: "Link", icon: "globe", link: m.linkHref }] : []
      },
      reasoning: m.reasoning,
    }))
  }

  function speakModals(list: ChatModal[]) {
    try {
      const synth = window.speechSynthesis
      if (!synth) return
      const utter = new SpeechSynthesisUtterance("I've updated the deck with new information.")
      synth.speak(utter)
    } catch { }
  }

  function saveResumeDraft(list: ChatModal[], query: string) {
    try {
      const draft = {
        name: "Adán Flores",
        email: "adan@example.com",
        phone: "+1 (408) 312-1647",
        sections: [
          {
            title: "Summary",
            items: [{ heading: "Role Fit Summary", subheading: query, bullets: ["Tailored summary."] }],
          },
        ].filter(Boolean),
      }
      localStorage.setItem("adam_resume_draft", JSON.stringify(draft))
    } catch { }
  }

  const closeModal = (id: string) => {
    setModals(prev => prev.filter(m => m.id !== id))
  }

  // --- Render ---

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#050505] text-white overflow-hidden relative font-sans">

      {/* --- GLOBAL BACKGROUND (Canvas) --- */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] opacity-20">
          <Image
            src="/images/adam.png"
            alt="Adam AI"
            fill
            className="object-contain animate-pulse-slow drop-shadow-2xl"
            priority
          />
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>
        </div>
      </div>

      {/* --- DESKTOP LEFT SIDEBAR (Expandable) --- */}
      <div
        className={`
           order-2 md:order-1 
           ${isSidebarOpen ? 'w-full md:w-80 lg:w-96' : 'w-full md:w-16'} 
           bg-black/80 backdrop-blur-md border-t md:border-t-0 md:border-r border-white/5 
           flex flex-col transition-all duration-300 relative z-50 shrink-0
           h-[30vh] md:h-full
         `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden md:flex absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-black border border-white/10 rounded-full items-center justify-center text-white/50 hover:text-white z-50 shadow-xl"
        >
          {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Header / Nav */}
        <div className={`p-4 flex ${isSidebarOpen ? 'justify-between' : 'justify-center'} items-center z-10`}>
          <Link href="/" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          {isSidebarOpen && (
            <h1 className="font-bold text-lg tracking-tight font-heading bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ADAM AI</h1>
          )}
        </div>

        {/* Chat History Area - USER MESSAGES ONLY */}
        {isSidebarOpen && (
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10 z-10 scroll-smooth">
            {/* Welcome msg if empty */}
            {conversationHistory.length === 0 && (
              <div className="mt-10 text-center space-y-4 opacity-50">
                <MessageSquare size={32} className="mx-auto text-blue-400" />
                <p className="text-sm font-sans">Ask about my experience, skills, or specific projects to see how I fit your needs.</p>
              </div>
            )}

            {conversationHistory.filter(e => e.role === 'user').map((entry, i) => (
              <div key={entry.timestamp || i} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-blue-600/20 border border-blue-500/30 text-white rounded-tr-sm font-sans">
                  {entry.content}
                </div>
              </div>
            ))}
            <div ref={chatBottomRef}></div>
          </div>
        )}

        {!isSidebarOpen && <div className="flex-1"></div>}

        {/* Input Area */}
        <div className="p-4 bg-black/50 border-t border-white/5 backdrop-blur z-10">
          <div className={`flex ${isSidebarOpen ? 'flex-col' : 'flex-col items-center'} gap-3`}>
            <div className="relative w-full">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder={isSidebarOpen ? "Ask about projects..." : ""}
                className={`
                            bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all font-sans
                            ${isSidebarOpen ? 'w-full' : 'w-10 h-10 p-0 text-center cursor-pointer hover:border-white/30'}
                        `}
                onFocus={() => !isSidebarOpen && setIsSidebarOpen(true)}
              />
              {!isSidebarOpen && !message && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <MessageSquare size={16} className="text-white/40" />
                </div>
              )}
            </div>

            {isSidebarOpen && (
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button className="text-xs text-white/40 hover:text-white flex items-center gap-1 font-sans" onClick={clearConversation}>
                    <RotateCcw size={12} /> Clear
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:text-white/20 text-white p-2 rounded-lg transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- RIGHT PANEL: Masonry Content Deck --- */}
      <div className="order-1 md:order-2 flex-1 h-[70vh] md:h-full overflow-y-auto relative scrollbar-thin scrollbar-thumb-white/10 p-4 md:p-8 z-10">
        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mx-auto max-w-7xl">

          {/* Intro Card (if empty) */}
          {modals.length === 0 && (
            <div className="break-inside-avoid bg-[#1a1a1a]/80 backdrop-blur rounded-xl p-8 border border-white/5 text-center">
              <Sparkles size={32} className="mx-auto text-yellow-500/50 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2 font-heading">Knowledge Deck</h2>
              <p className="text-white/50 text-sm font-sans">
                I am a context-aware portfolio assistant. As we chat, relevant project cards, skills, and summaries will appear here in real-time.
              </p>
            </div>
          )}

          {/* Modals / Cards */}
          {modals.map((modal) => (
            <div key={modal.id} className="break-inside-avoid animate-in fade-in slide-in-from-bottom-8 duration-700">
              <ContentCard modal={modal} onClose={() => closeModal(modal.id)} />
            </div>
          ))}

          {/* Resume CTA (Static) */}
          <div className="break-inside-avoid p-[1px] rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 group cursor-pointer hover:shadow-2xl hover:shadow-purple-500/10 transition-all">
            <div className="bg-[#151515]/90 backdrop-blur rounded-xl p-6 relative overflow-hidden h-full">
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Custom Resume</h3>
                  <p className="text-xs text-white/50 mt-1 font-sans">Generated from deck context</p>
                </div>
                <div className="p-3 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                  <Download size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-20"></div>
      </div>
    </div>
  )
}

// --- Subcomponents ---

function ContentCard({ modal, onClose }: { modal: ChatModal; onClose: () => void }) {
  const isProj = modal.type === 'project'
  const isSum = modal.type === 'summary'

  // Icon mapping
  const getIcon = (type: string) => {
    if (type.includes('github')) return <Github size={14} />
    if (type.includes('youtube')) return <Youtube size={14} />
    if (type.includes('paper') || type.includes('pdf')) return <FileText size={14} />
    return <Globe size={14} />
  }

  // SUMMARY CARD VARIANT
  if (isSum) {
    return (
      <div className="group relative rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/5 hover:border-white/10 bg-gradient-to-br from-[#1a1a2e]/90 to-[#16213e]/90 backdrop-blur p-6">
        <button onClick={onClose} className="absolute top-2 right-2 p-1.5 text-white/20 hover:text-white transition-all z-20">
          <X size={12} />
        </button>
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
            <Sparkles size={16} className="text-blue-400" />
          </div>
          <p className="text-sm text-white/80 leading-relaxed font-sans font-md">
            {modal.content.description}
          </p>
        </div>
      </div>
    )
  }

  // STANDARD CARD VARIANT
  return (
    <div className="group relative rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/5 hover:border-white/10 bg-[#1c1c1f]/90 backdrop-blur">

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 text-white/50 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur"
      >
        <X size={12} />
      </button>

      {/* Image */}
      {modal.content.images && modal.content.images.length > 0 && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={modal.content.images[0]}
            alt={modal.title || ""}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1f] to-transparent opacity-90"></div>
        </div>
      )}

      {/* Content */}
      <div className="p-5 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full font-heading ${isProj ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
            }`}>
            {modal.type}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors font-heading">{modal.title}</h3>

        {modal.content.role && (
          <p className="text-sm text-white/50 mb-2 font-medium font-sans">{modal.content.role} • {modal.content.company}</p>
        )}

        <p className="text-sm text-white/70 leading-relaxed mb-4 line-clamp-6 whitespace-pre-line font-sans">
          {modal.content.description}
        </p>

        {/* Skills (Pills) */}
        {modal.content.technologies && modal.content.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {modal.content.technologies.slice(0, 5).map((tech: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-[#2a2a2d] rounded-full text-xs text-white/70 hover:text-white transition-colors border border-white/5 font-sans">
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links (Icons) */}
        <div className="flex items-center gap-2 border-t border-white/5 pt-3 mt-2 empty:hidden">
          {modal.content.urls && modal.content.urls.map((url: any, i: number) => (
            <a
              key={i}
              href={url.link}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-blue-600 hover:text-white rounded-full text-white/40 transition-all"
              title={url.name}
            >
              {getIcon(url.icon)}
            </a>
          ))}

          {modal.content.demoUrl && (
            <a href={modal.content.demoUrl} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-red-500 hover:text-white rounded-full text-white/40 transition-all" title="Demo">
              <Youtube size={14} />
            </a>
          )}

          {modal.content.downloadUrl && (
            <a href={modal.content.downloadUrl} className="ml-auto flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors font-sans">
              Download PDF <Download size={12} />
            </a>
          )}
        </div>

        {/* Reasoning Footer (Except for Summary) */}
        {!isSum && modal.reasoning && (
          <div className="mt-3 pt-2 border-t border-white/5">
            <p className="text-[10px] text-white/30 italic flex items-start gap-1 font-sans">
              <span className="text-blue-500/50">Reasoning:</span> {modal.reasoning}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
