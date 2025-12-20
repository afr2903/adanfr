import { NextResponse } from "next/server"
import { experiences } from "@/data/experiences"
import { projects } from "@/data/projects"
import { education } from "@/data/education"
import type { AdamModal, AdamResponse } from "@/lib/adam-types"
import { b as bamlClient } from "../../../baml_client"
import { Collector } from "@boundaryml/baml"
import { getDb } from "@/lib/mongodb"

function normalizeText(value: unknown): string {
  if (value == null) return ""
  if (Array.isArray(value)) return value.map((v) => normalizeText(v)).join("\n")
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).map(normalizeText).join("\n")
  return String(value)
}


function buildExperienceModal(id: string): AdamModal | null {
  const exp = experiences.find((e) => e.id === id) as any
  if (!exp) return null
  return {
    id: `experience-${exp.id}`,
    type: "experience",
    title: `${exp.role} — ${exp.company}`,
    body: exp.details.description,
    images: exp.details.images,
    sourceIds: [exp.id],
    // Enhanced fields
    technologies: exp.details?.skills || [],
    client: exp.client || exp.company,
    industry: exp.industry || null,
    date: exp.period || null,
    role: exp.role,
    company: exp.company,
    urls: exp.urls || [],
  }
}

function buildProjectModal(id: string): AdamModal | null {
  const proj = projects.find((p) => p.id === id) as any
  if (!proj) return null
  // Parse technologies from comma-separated string
  const techArray = typeof proj.technologies === 'string'
    ? proj.technologies.split(',').map((t: string) => t.trim())
    : proj.technologies || []
  return {
    id: `project-${proj.id}`,
    type: "project",
    title: proj.title,
    body: proj.projectInfo,
    images: proj.details?.images,
    sourceIds: [proj.id],
    // Enhanced fields
    technologies: techArray,
    client: proj.client || null,
    industry: proj.industry || null,
    date: proj.date || null,
    urls: proj.urls || [],
  }
}

function buildEducationModal(id: string): AdamModal | null {
  const edu = education.find((e) => e.id === id) as any
  if (!edu) return null
  const images = edu.images || (edu.image ? [edu.image] : [])
  return {
    id: `education-${edu.id}`,
    type: "education",
    title: `${edu.degree} — ${edu.institution}`,
    body: edu.description,
    images: images,
    sourceIds: [edu.id],
    // Enhanced fields
    client: edu.institution,
    date: edu.period || `${edu.startYear} - ${edu.endYear || 'Present'}`,
    technologies: edu.coursework || [],
  }
}


function buildSummaryModal(message: string, picked: AdamModal[]): AdamModal {
  const bullets = picked
    .filter((m) => m.type !== "summary") // Don't include summary in summary
    .map((m) => `• ${m.title}`)
    .join("\n")

  const body = [
    `Based on your query: "${message}"`,
    "",
    "I've selected these relevant highlights:",
    bullets || "• Check out my resume for a complete overview",
  ].filter(Boolean)

  return {
    id: `summary-${Date.now()}`,
    type: "summary",
    title: "How I match your needs",
    body,
  }
}

// Log analytics to MongoDB (non-blocking, fails silently if MongoDB not configured)
async function logAnalytics(data: {
  userMessage: string
  modals: any[]
  lens: string
  collector: Collector
  duration: number
  historyLength: number
}) {
  try {
    if (!process.env.MONGODB_URI) {
      return // MongoDB not configured, skip silently
    }

    const db = await getDb()
    const log = data.collector.last
    
    // Extract model info from the selected call
    const selectedCall = log?.selectedCall || (log?.calls && log.calls.length > 0 ? log.calls[log.calls.length - 1] : null)
    const model = (selectedCall as any)?.clientName || (selectedCall as any)?.provider || 'google/gemini-3-flash-preview'
    
    // Extract usage info
    const usage = log?.usage || data.collector.usage
    const inputTokens = (usage as any)?.inputTokens ?? (usage as any)?.input_tokens ?? null
    const outputTokens = (usage as any)?.outputTokens ?? (usage as any)?.output_tokens ?? null
    const cachedInputTokens = (usage as any)?.cachedInputTokens ?? (usage as any)?.cached_input_tokens ?? null
    
    // Extract timing
    const timing = log?.timing
    const bamlLatency = (timing as any)?.durationMs ?? (timing as any)?.duration_ms ?? data.duration

    // Filter out null/undefined fields from modals
    const cleanModals = data.modals.map(m => {
      const clean: any = {}
      Object.keys(m).forEach(key => {
        const value = (m as any)[key]
        if (value !== null && value !== undefined) {
          clean[key] = value
        }
      })
      return clean
    })

    await db.collection('adam_interactions').insertOne({
      userMessage: data.userMessage,
      modals: cleanModals, // Store modals without null fields
      modalsCount: data.modals.length,
      modalTypes: data.modals.map(m => m.type),
      lens: data.lens,
      historyLength: data.historyLength,
      // BAML metrics
      model: model,
      latency: bamlLatency,
      inputTokens: inputTokens,
      outputTokens: outputTokens,
      cachedInputTokens: cachedInputTokens,
      totalTokens: inputTokens && outputTokens ? inputTokens + outputTokens : null,
      // Timestamps
      timestamp: Date.now(),
      createdAt: new Date()
    })
  } catch (error) {
    // Fail silently - don't break the API if analytics fails
    console.error("Analytics logging error:", error)
  }
}


export async function POST(req: Request) {
  try {
    const { message, lens, history } = (await req.json()) as { message?: string; lens?: string; history?: string[] }
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Format conversation history for the prompt
    const conversationHistory = Array.isArray(history) && history.length > 0
      ? history.map((h, i) => `[${i % 2 === 0 ? 'User' : 'Assistant'}]: ${h}`).join('\n')
      : ''

    console.log("\n🔵 === NEW REQUEST ===")
    console.log("📩 User message:", message)
    console.log("📜 Conversation history entries:", history?.length || 0)
    console.log("🔑 OPENROUTER_API_KEY exists:", !!process.env.OPENROUTER_API_KEY)

    // Try using BAML client if OPENROUTER_API_KEY is set
    if (process.env.OPENROUTER_API_KEY) {
      try {
        console.log("🔄 BAML client imported statically")
        console.log("✅ BAML client ready, function exists:", !!bamlClient.GenerateAdamModals)

          // Prepare context for BAML
          console.log("📝 Preparing context...")
          const experiencesContext = experiences.map(exp =>
            `ID: ${exp.id}\n` +
            `Company: ${exp.company}\n` +
            `Role: ${exp.role}\n` +
            `Period: ${exp.period}\n` +
            `Description: ${exp.description}\n` +
            `Details: ${Array.isArray(exp.details.description) ? exp.details.description.join(' ') : exp.details.description}\n` +
            `Skills: ${exp.details.skills.join(', ')}\n` +
            `Images: ${exp.details.images.join(', ')}\n`
          ).join('\n---\n')

          const projectsContext = projects.map(proj =>
            `ID: ${proj.id}\n` +
            `Title: ${proj.title}\n` +
            `Category: ${proj.category}\n` +
            `Info: ${Array.isArray(proj.projectInfo) ? proj.projectInfo.join(' ') : proj.projectInfo}\n` +
            `Technologies: ${proj.technologies}\n` +
            `Industry: ${proj.industry}\n` +
            `Date: ${proj.date}\n` +
            `Images: ${proj.details?.images?.join(', ') || 'none'}\n` +
            (proj.urls && proj.urls.length > 0
              ? `URLs:\n${proj.urls.map(url => `  - Name: ${url.name}\n    Link: ${url.link}\n    Icon: ${url.icon || 'globe'}`).join('\n')}\n`
              : `URLs: none\n`)
          ).join('\n---\n')

        console.log("📊 Context prepared - Experiences:", experiences.length, "Projects:", projects.length)
        console.log("🚀 Calling BAML GenerateAdamModals...")
        console.log("🔍 Lens:", lens || 'none')

        // Create collector to track usage and timing
        const collector = new Collector("adam-analytics")
        const startTime = Date.now()
        const aiResp = await bamlClient.GenerateAdamModals(
          message, 
          experiencesContext, 
          projectsContext, 
          conversationHistory, 
          lens || 'none',
          { collector }
        )
        const duration = Date.now() - startTime

        console.log(`⏱️  BAML call completed in ${duration}ms`)
        console.log("📦 Raw BAML response:", JSON.stringify(aiResp, null, 2))

        // Convert BAML response to our type (handle null values)
        const asResp: AdamResponse = {
          ...aiResp,
          modals: aiResp.modals.map(m => {
            const modal: any = {
              id: m.id,
              type: m.type as any, // Type assertion needed due to case differences
              title: m.title,
              body: m.body,
              reasoning: m.reasoning ?? undefined,
              images: m.images ?? undefined,
              sourceIds: m.sourceIds ?? undefined,
              technologies: m.technologies ?? undefined,
              client: m.client ?? undefined,
              industry: m.industry ?? undefined,
              date: m.date ?? undefined,
              role: m.role ?? undefined,
              company: m.company ?? undefined,
              urls: m.urls ?? undefined
            }
            // Add linkHref/linkLabel if they exist in the BAML response
            if ('linkHref' in m) modal.linkHref = (m as any).linkHref ?? undefined
            if ('linkLabel' in m) modal.linkLabel = (m as any).linkLabel ?? undefined
            return modal as AdamModal
          })
        }

        if (asResp && Array.isArray(asResp.modals) && asResp.modals.length > 0) {
          console.log("✅ BAML response generated successfully")
          console.log("📋 Number of modals:", asResp.modals.length)
          console.log("📋 Modal types:", asResp.modals.map(m => m.type).join(", "))
          
          // Log analytics to MongoDB, use raw BAML response
          logAnalytics({
            userMessage: message,
            modals: aiResp.modals as any, // Store raw BAML response with nulls
            lens: lens || 'none',
            collector,
            duration,
            historyLength: history?.length || 0
          }).catch(err => console.error("Analytics logging failed:", err))
          
          return NextResponse.json(asResp)
        } else {
          console.log("⚠️  BAML response invalid or empty, falling back to heuristics")
        }
      } catch (bamlError) {
        console.error("❌ BAML error, falling back to heuristics:")
        console.error(bamlError)
        if (bamlError instanceof Error) {
          console.error("Error stack:", bamlError.stack)
        }
      }
    } else {
      console.log("⚠️  No OPENROUTER_API_KEY found, using heuristics")
    }

    // Fallback heuristic
    console.log("Error, modals won't be generated")
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  } catch (error) {
    console.error("/api/adam error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}


