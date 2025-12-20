"use client"

import { useEffect, useRef, useState } from "react"
import { Send, ArrowLeft, X, Download, ExternalLink, Mic, MicOff, RotateCcw, Sparkles, Github, Youtube, FileText, Globe, MessageSquare, ChevronLeft, ChevronRight, Building2, Calendar, Briefcase, GraduationCap, User, Users, Search, Lightbulb, Link as LinkIcon, Eye, Loader2, Brain } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ENABLE_BAML, ENABLE_DYNAMIC_RESUME, ENABLE_SPEECH } from "@/lib/feature-flags"
import type { AdamResponse, LensType } from "@/lib/adam-types"
import { LENS_CONTEXTS } from "@/lib/adam-types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ResumePreviewModal } from "@/components/resume"
import type { ResumeData } from "@/types/resume"

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

const LENS_ICONS: Record<LensType, React.ReactNode> = {
  none: <Sparkles size={14} />,
  recruiter: <Briefcase size={14} />,
  collaborator: <Users size={14} />,
  researcher: <Search size={14} />,
  founder: <Lightbulb size={14} />
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

  // Resume generation state
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isGeneratingResume, setIsGeneratingResume] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [canGenerate, setCanGenerate] = useState(false) // Enabled after first message, disabled after clicking until new message
  const [messagesSinceLastPreview, setMessagesSinceLastPreview] = useState(0)

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
    setResumeData(null)
    setCanGenerate(false)
    setMessagesSinceLastPreview(0)
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

    // Enable Generate button and track that new messages have been sent since last preview
    setCanGenerate(true)
    setMessagesSinceLastPreview(prev => prev + 1)

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
            message: userMessage,
            lens: activeLens,
            history: getHistoryForAPI() // API receives all, UI filters display
          }),
        })
        const data: AdamResponse = await res.json()
        const messageIndex = updatedHistory.filter(e => e.role === 'user').length
        const mapped = mapAdamResponseToChatModals(data, messageIndex)

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
      const messageIndex = updatedHistory.filter(e => e.role === 'user').length
      setTimeout(() => {
        generateModals(userMessage, messageIndex)
        setIsTyping(false)
      }, 1200)
    }
  }

  const generateModals = (userMessage: string, messageIndex: number) => {
    const newModals: ChatModal[] = []

    if (userMessage.toLowerCase().includes("vision")) {
      newModals.push({
        id: `${messageIndex}-experience-vision`,
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
      id: `${messageIndex}-summary`,
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

  function mapAdamResponseToChatModals(resp: AdamResponse, messageIndex: number): ChatModal[] {
    return (resp.modals || []).map((m: any) => ({
      id: `${messageIndex}-${m.id}`,
      type: (m.type?.toLowerCase() as any) ?? "project",
      title: m.title,
      content: {
        description: Array.isArray(m.body) ? m.body.join("\n\n") : m.body,
        images: m.images || [],
        downloadUrl: m.linkHref,
        // Enhanced data fields
        technologies: m.technologies || [],
        client: m.client || null,
        industry: m.industry || null,
        date: m.date || null,
        role: m.role || null,
        company: m.company || null,
        // URLs with proper structure
        urls: m.urls || (m.linkHref ? [{ name: m.linkLabel || "Link", icon: "globe", link: m.linkHref }] : [])
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

  // --- Resume Generation ---
  const handleGenerateResume = async () => {
    if (!canGenerate || isGeneratingResume) return

    setIsGeneratingResume(true)
    setCanGenerate(false) // Disable Generate button until new message is sent

    try {
      // Get user messages from conversation history
      const userMessages = conversationHistory
        .filter(entry => entry.role === 'user')
        .map(entry => entry.content)

      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessages }),
      })

      const data = await res.json()

      if (data.resume) {
        setResumeData(data.resume)
        setShowResumeModal(true)
        setMessagesSinceLastPreview(0) // Reset counter after successful generation
      } else {
        console.error("Resume generation failed:", data.error)
      }
    } catch (error) {
      console.error("Resume generation error:", error)
    } finally {
      setIsGeneratingResume(false)
    }
  }

  const handlePreviewResume = () => {
    if (!resumeData) return
    // Open the modal to preview the resume
    setShowResumeModal(true)
  }

  // --- Render ---

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#0a0a0a] text-white overflow-hidden relative" style={{ fontFamily: 'var(--font-figtree), ui-sans-serif, system-ui' }}>

      {/* --- GLOBAL BACKGROUND (Canvas) --- */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] opacity-15">
          <Image
            src="/images/adam.png"
            alt="Adam AI"
            fill
            className="object-contain drop-shadow-2xl"
            style={{ animation: 'pulse 4s ease-in-out infinite' }}
            priority
          />
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-[120px] mix-blend-screen"></div>
        </div>
      </div>

      {/* --- DESKTOP LEFT SIDEBAR (Expandable) --- */}
      <div
        className={`
           order-2 md:order-1
           ${isSidebarOpen ? 'w-full md:w-80 lg:w-96' : 'w-full md:w-16'}
           bg-[#121212]/95 backdrop-blur-md border-t md:border-t-0 md:border-r border-white/5
           flex flex-col transition-all duration-300 relative z-50 shrink-0
           h-[40vh] md:h-full
         `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden md:flex absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-[#1a1a1a] border border-white/10 rounded-full items-center justify-center text-white/50 hover:text-white z-50 shadow-xl"
        >
          {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Header / Nav */}
        <div className={`p-4 flex ${isSidebarOpen ? 'justify-between' : 'justify-center'} items-center z-10`}>
          <Link href="/" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/30">
                <Image
                  src="/images/adam.png"
                  alt="Adam"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-semibold text-sm text-white/80" style={{ fontFamily: 'var(--font-dm-sans)' }}>Adam</span>
            </div>
          )}
        </div>

        {/* Persona Selector */}
        {isSidebarOpen && (
          <div className="px-4 pb-3 z-10">
            <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>View as</p>
            <Select value={activeLens} onValueChange={(v) => setActiveLens(v as LensType)}>
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors h-9">
                <SelectValue placeholder="Select Persona">
                  <div className="flex items-center gap-2">
                    {LENS_ICONS[activeLens]}
                    <span>{LENS_LABELS[activeLens]}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                {(Object.keys(LENS_LABELS) as LensType[]).map((lens) => (
                  <SelectItem key={lens} value={lens} className="focus:bg-white/10 focus:text-white cursor-pointer">
                    <div className="flex items-center gap-2">
                      {LENS_ICONS[lens as LensType]}
                      <span>{LENS_LABELS[lens as LensType]}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Chat History Area - USER MESSAGES ONLY */}
        {isSidebarOpen && (
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10 z-10 scroll-smooth">
            {/* Welcome msg if empty */}
            {conversationHistory.length === 0 && (
              <div className="mt-10 text-center space-y-4 opacity-50">
                <MessageSquare size={32} className="mx-auto text-primary" />
                <p className="text-sm">Ask about my experience, skills, or specific projects to see how I fit your needs.</p>
              </div>
            )}

            {conversationHistory.filter(e => e.role === 'user').map((entry, i) => (
              <div key={entry.timestamp || i} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-primary/15 border border-primary/20 text-white rounded-tr-sm">
                  {entry.content}
                </div>
              </div>
            ))}
            <div ref={chatBottomRef}></div>
          </div>
        )}

        {!isSidebarOpen && <div className="flex-1"></div>}

        {/* Input Area */}
        <div className="p-4 bg-[#0f0f0f]/80 border-t border-white/5 backdrop-blur z-10">
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
                            bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-all
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
                  <button className="text-xs text-white/40 hover:text-white flex items-center gap-1" onClick={clearConversation}>
                    <RotateCcw size={12} /> Clear
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-primary hover:bg-primary/80 disabled:bg-white/10 disabled:text-white/20 text-white p-2 rounded-xl transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- RIGHT PANEL: Masonry Content Deck --- */}
      <div className="order-1 md:order-2 flex-1 min-h-0 overflow-y-auto relative scrollbar-thin scrollbar-thumb-white/10 p-4 md:p-8 z-10">
        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5 mx-auto max-w-7xl">

          {/* Intro Card (if empty) */}
          {modals.length === 0 && (
            <div className="break-inside-avoid bg-[#1a1a1a]/90 backdrop-blur rounded-xl p-8 border border-white/5 text-center">
              <Sparkles size={32} className="mx-auto text-primary/50 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Knowledge Deck</h2>
              <p className="text-white/50 text-sm">
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

          {/* Resume CTA with Eye and Download buttons */}
          <div className="break-inside-avoid p-[1px] rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 group hover:shadow-2xl hover:shadow-primary/10 transition-all">
            <div className="bg-[#151515]/95 backdrop-blur rounded-xl p-6 relative overflow-hidden h-full">
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-dm-sans)' }}>(WIP) Custom Resume</h3>
                    <p className="text-xs text-white/50 mt-1">
                      {conversationHistory.filter(e => e.role === 'user').length === 0
                        ? "Send a message to enable generation"
                        : resumeData
                          ? "Resume generated from conversation"
                          : "Click Generate to create from context"
                      }
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Generate Button */}
                  <button
                    onClick={handleGenerateResume}
                    disabled={!canGenerate || isGeneratingResume}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${canGenerate && !isGeneratingResume
                        ? 'bg-white/10 hover:bg-white/20 text-white cursor-pointer'
                        : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }
                    `}
                    title={
                      !canGenerate && conversationHistory.filter(e => e.role === 'user').length === 0
                        ? "Send a message first"
                        : !canGenerate
                          ? "Send a new message to regenerate"
                          : "Generate resume"
                    }
                  >
                    {isGeneratingResume ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain size={16} />
                        Generate
                      </>
                    )}
                  </button>

                  {/* Preview Button */}
                  <button
                    onClick={handlePreviewResume}
                    disabled={!resumeData}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${resumeData
                        ? 'bg-primary hover:bg-primary/80 text-white cursor-pointer'
                        : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }
                    `}
                    title={!resumeData ? "Generate a resume first" : "Preview resume"}
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                </div>

                {/* New messages indicator */}
                {resumeData && messagesSinceLastPreview > 0 && (
                  <p className="text-xs text-primary/70 mt-3 flex items-center gap-1">
                    <Sparkles size={12} />
                    {messagesSinceLastPreview} new message{messagesSinceLastPreview > 1 ? 's' : ''} since last preview
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="h-20"></div>
      </div>

      {/* Resume Preview Modal */}
      {resumeData && (
        <ResumePreviewModal
          data={resumeData}
          isOpen={showResumeModal}
          onClose={() => setShowResumeModal(false)}
        />
      )}
    </div>
  )
}

// --- Subcomponents ---

// Image Carousel for multiple images
function ImageCarousel({ images, title }: { images: string[]; title?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  if (images.length === 1) {
    return (
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={images[0]}
          alt={title || ""}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1f] via-transparent to-transparent opacity-95"></div>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden">
      <Image
        src={images[currentIndex]}
        alt={`${title || "Image"} ${currentIndex + 1} of ${images.length}`}
        fill
        className="object-cover transition-all duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1f] via-transparent to-transparent opacity-95"></div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 z-10"
        aria-label="Next image"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex(index)
            }}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// Type badge colors
const TYPE_STYLES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  project: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: <Briefcase size={10} /> },
  experience: { bg: 'bg-purple-500/10', text: 'text-purple-400', icon: <Building2 size={10} /> },
  education: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: <GraduationCap size={10} /> },
  resume: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: <FileText size={10} /> },
  summary: { bg: 'bg-primary/10', text: 'text-primary', icon: <Sparkles size={10} /> },
}

function ContentCard({ modal, onClose }: { modal: ChatModal; onClose: () => void }) {
  const isSum = modal.type === 'summary'
  const isResume = modal.type === 'resume'
  const typeStyle = TYPE_STYLES[modal.type] || TYPE_STYLES.project

  // Icon mapping for URLs
  const getUrlIcon = (iconStr: string, name: string) => {
    const lowerIcon = (iconStr || '').toLowerCase()
    const lowerName = (name || '').toLowerCase()
    if (lowerIcon.includes('github') || lowerName.includes('github')) return <Github size={14} />
    if (lowerIcon.includes('youtube') || lowerName.includes('youtube') || lowerName.includes('video') || lowerName.includes('demo')) return <Youtube size={14} />
    if (lowerIcon.includes('paper') || lowerIcon.includes('file') || lowerIcon.includes('newspaper') || lowerName.includes('paper') || lowerName.includes('publication') || lowerName.includes('report')) return <FileText size={14} />
    if (lowerIcon.includes('slide') || lowerName.includes('presentation') || lowerName.includes('slide')) return <FileText size={14} />
    return <Globe size={14} />
  }

  // SUMMARY CARD VARIANT
  if (isSum) {
    return (
      <div className="group relative rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/5 hover:border-primary/20 bg-gradient-to-br from-[#1a1a2e]/90 to-[#16213e]/90 backdrop-blur p-5">
        <button onClick={onClose} className="absolute top-2 right-2 p-1.5 text-white/20 hover:text-white transition-all z-20">
          <X size={12} />
        </button>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-xl shrink-0">
            <Sparkles size={16} className="text-primary" />
          </div>
          <p className="text-sm text-white/80 leading-relaxed">
            {modal.content.description}
          </p>
        </div>
      </div>
    )
  }

  // STANDARD CARD VARIANT (Project, Experience, Education)
  return (
    <div className="group relative rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/5 hover:border-white/10 bg-[#1c1c1f]/95 backdrop-blur">

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 text-white/50 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur"
      >
        <X size={12} />
      </button>

      {/* Image Carousel */}
      {modal.content.images && modal.content.images.length > 0 && (
        <ImageCarousel images={modal.content.images} title={modal.title} />
      )}

      {/* Content */}
      <div className="p-5 relative z-10">
        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${typeStyle.bg} ${typeStyle.text}`} style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {typeStyle.icon}
            {modal.type}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-dm-sans)' }}>{modal.title}</h3>

        {/* Role/Company for Experience */}
        {modal.content.role && (
          <p className="text-sm text-white/50 mb-2 font-medium">{modal.content.role} {modal.content.company && `• ${modal.content.company}`}</p>
        )}

        {/* Description */}
        <p className="text-sm text-white/70 leading-relaxed mb-4 whitespace-pre-line">
          {modal.content.description}
        </p>

        {/* Details Section (Client, Industry, Date) */}
        {(modal.content.client || modal.content.industry || modal.content.date) && (
          <div className="mb-4 space-y-1.5 text-xs text-white/50">
            {modal.content.client && (
              <div className="flex items-center gap-2">
                <Building2 size={12} className="text-white/30" />
                <span>{modal.content.client}</span>
              </div>
            )}
            {modal.content.industry && (
              <div className="flex items-center gap-2">
                <Briefcase size={12} className="text-white/30" />
                <span>{modal.content.industry}</span>
              </div>
            )}
            {modal.content.date && (
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-white/30" />
                <span>{modal.content.date}</span>
              </div>
            )}
          </div>
        )}

        {/* Technologies (Pills) */}
        {modal.content.technologies && modal.content.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {modal.content.technologies.slice(0, 6).map((tech: string, i: number) => (
              <span key={i} className="px-2.5 py-1 bg-[#252525] rounded text-[11px] text-white/60 hover:text-white hover:bg-[#333] transition-colors border border-white/5">
                {tech}
              </span>
            ))}
            {modal.content.technologies.length > 6 && (
              <span className="px-2.5 py-1 bg-[#252525] rounded text-[11px] text-white/40 border border-white/5">
                +{modal.content.technologies.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Links Section */}
        {modal.content.urls && modal.content.urls.length > 0 && (
          <div className="border-t border-white/5 pt-3 mt-2">
            <div className="flex flex-wrap gap-2">
              {modal.content.urls.map((url: any, i: number) => (
                <a
                  key={i}
                  href={url.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-primary/20 hover:text-primary rounded text-xs text-white/50 transition-all"
                >
                  {getUrlIcon(url.icon, url.name)}
                  <span>{url.name || 'Link'}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Download URL (for resume type or if present) */}
        {modal.content.downloadUrl && !modal.content.urls && (
          <div className="border-t border-white/5 pt-3 mt-2">
            <a
              href={modal.content.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              <Download size={12} />
              Download PDF
            </a>
          </div>
        )}

        {/* Reasoning Footer */}
        {modal.reasoning && (
          <div className="mt-3 pt-2 border-t border-white/5">
            <p className="text-[10px] text-white/30 italic leading-relaxed">
              <span className="text-primary/50 font-medium not-italic">Why this was selected:</span>{' '}
              {modal.reasoning}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
