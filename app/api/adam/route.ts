import { NextResponse } from "next/server"
import {
  getExperiences,
  getProjects,
  getPrompt,
  formatExperiencesContext,
  formatProjectsContext,
} from "@/lib/db/content"
import type { Experience, Project } from "@/lib/db/types"
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

// ---------------------------------------------------------------------------
// Modal builders (look up from the fetched data arrays)
// ---------------------------------------------------------------------------

function buildExperienceModal(id: string, experiences: Experience[]): AdamModal | null {
  const exp = experiences.find((e) => e.id === id) as any
  if (!exp) return null
  return {
    id: `experience-${exp.id}`,
    type: "experience",
    title: `${exp.role} — ${exp.company}`,
    body: exp.details.description,
    images: exp.details.images,
    sourceIds: [exp.id],
    technologies: exp.details?.skills || [],
    client: exp.client || exp.company,
    industry: exp.industry || null,
    date: exp.period || null,
    role: exp.role,
    company: exp.company,
    urls: exp.urls || [],
  }
}

function buildProjectModal(id: string, projects: Project[]): AdamModal | null {
  const proj = projects.find((p) => p.id === id) as any
  if (!proj) return null
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
    technologies: techArray,
    client: proj.client || null,
    industry: proj.industry || null,
    date: proj.date || null,
    urls: proj.urls || [],
  }
}

function buildSummaryModal(message: string, picked: AdamModal[]): AdamModal {
  const bullets = picked
    .filter((m) => m.type !== "summary")
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

// ---------------------------------------------------------------------------
// Analytics logger
// ---------------------------------------------------------------------------
async function logAnalytics(data: {
  userMessage: string
  modals: any[]
  lens: string
  collector: Collector
  duration: number
  historyLength: number
}) {
  try {
    if (!process.env.MONGODB_URI) return

    const db = await getDb()
    const log = data.collector.last
    const selectedCall = log?.selectedCall || (log?.calls && log.calls.length > 0 ? log.calls[log.calls.length - 1] : null)
    const model = (selectedCall as any)?.clientName || (selectedCall as any)?.provider || 'google/gemini-3-flash-preview'
    const usage = log?.usage || data.collector.usage
    const inputTokens = (usage as any)?.inputTokens ?? (usage as any)?.input_tokens ?? null
    const outputTokens = (usage as any)?.outputTokens ?? (usage as any)?.output_tokens ?? null
    const cachedInputTokens = (usage as any)?.cachedInputTokens ?? (usage as any)?.cached_input_tokens ?? null
    const timing = log?.timing
    const bamlLatency = (timing as any)?.durationMs ?? (timing as any)?.duration_ms ?? data.duration

    const cleanModals = data.modals.map(m => {
      const clean: any = {}
      Object.keys(m).forEach(key => {
        const value = (m as any)[key]
        if (value !== null && value !== undefined) clean[key] = value
      })
      return clean
    })

    await db.collection('adam_interactions').insertOne({
      userMessage: data.userMessage,
      modals: cleanModals,
      modalsCount: data.modals.length,
      modalTypes: data.modals.map(m => m.type),
      lens: data.lens,
      historyLength: data.historyLength,
      model,
      latency: bamlLatency,
      inputTokens,
      outputTokens,
      cachedInputTokens,
      totalTokens: inputTokens && outputTokens ? inputTokens + outputTokens : null,
      timestamp: Date.now(),
      createdAt: new Date()
    })
  } catch (error) {
    console.error("Analytics logging error:", error)
  }
}

// ---------------------------------------------------------------------------
// Prompt assembly — builds the full system prompt from DB content + data
// ---------------------------------------------------------------------------
async function assembleSystemPrompt(
  lens: string,
  experiencesContext: string,
  projectsContext: string,
): Promise<string> {
  const prompt = await getPrompt('adam_prompt')
  if (!prompt) throw new Error('adam_prompt not found in database — run the seed script first')

  const lensText = (lens && lens !== 'none' && prompt.lens[lens])
    ? `The visitor is viewing your portfolio through the ${lens} lens. Adjust your response accordingly:\n${prompt.lens[lens]}`
    : 'No specific lens - respond naturally to the visitor\'s question.'

  return [
    prompt.base_prompt,
    `\n<viewpoint_lens>\n${lensText}\n</viewpoint_lens>`,
    `\n<available_data>\nMY EXPERIENCES:\n${experiencesContext}\n\nMY PROJECTS:\n${projectsContext}\n</available_data>`,
  ].join('\n')
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const { message, lens, history } = (await req.json()) as { message?: string; lens?: string; history?: string[] }
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const conversationHistory = Array.isArray(history) && history.length > 0
      ? history.map((h, i) => `[${i % 2 === 0 ? 'User' : 'Assistant'}]: ${h}`).join('\n')
      : ''

    console.log("\n🔵 === NEW REQUEST ===")
    console.log("📩 User message:", message)
    console.log("📜 Conversation history entries:", history?.length || 0)
    console.log("🔑 OPENROUTER_API_KEY exists:", !!process.env.OPENROUTER_API_KEY)

    if (process.env.OPENROUTER_API_KEY) {
      try {
        // Fetch data from MongoDB
        const [experiences, projects] = await Promise.all([
          getExperiences(),
          getProjects(),
        ])

        const experiencesContext = formatExperiencesContext(experiences)
        const projectsContext = formatProjectsContext(projects)

        console.log("📊 Context prepared - Experiences:", experiences.length, "Projects:", projects.length)

        // Assemble system prompt from DB
        const systemPrompt = await assembleSystemPrompt(lens || 'none', experiencesContext, projectsContext)

        // Build user prompt
        const userPrompt = conversationHistory
          ? `<conversation_context>\nPrevious conversation:\n${conversationHistory}\n\nCurrent message from visitor:\n${message}\n</conversation_context>`
          : `<conversation_context>\nCurrent message from visitor:\n${message}\n</conversation_context>`

        console.log("🚀 Calling BAML GenerateAdamModals...")
        console.log("🔍 Lens:", lens || 'none')

        const collector = new Collector("adam-analytics")
        const startTime = Date.now()
        const aiResp = await bamlClient.GenerateAdamModals(
          systemPrompt,
          userPrompt,
          { collector }
        )
        const duration = Date.now() - startTime

        console.log(`⏱️  BAML call completed in ${duration}ms`)
        console.log("📦 Raw BAML response:", JSON.stringify(aiResp, null, 2))

        const asResp: AdamResponse = {
          ...aiResp,
          modals: aiResp.modals.map(m => {
            const modal: any = {
              id: m.id,
              type: m.type as any,
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
            if ('linkHref' in m) modal.linkHref = (m as any).linkHref ?? undefined
            if ('linkLabel' in m) modal.linkLabel = (m as any).linkLabel ?? undefined
            return modal as AdamModal
          })
        }

        if (asResp && Array.isArray(asResp.modals) && asResp.modals.length > 0) {
          console.log("✅ BAML response generated successfully")
          console.log("📋 Number of modals:", asResp.modals.length)
          console.log("📋 Modal types:", asResp.modals.map(m => m.type).join(", "))

          logAnalytics({
            userMessage: message,
            modals: aiResp.modals as any,
            lens: lens || 'none',
            collector,
            duration,
            historyLength: history?.length || 0
          }).catch(err => console.error("Analytics logging failed:", err))

          return NextResponse.json(asResp)
        } else {
          console.log("⚠️  BAML response invalid or empty")
        }
      } catch (bamlError) {
        console.error("❌ BAML error:")
        console.error(bamlError)
        if (bamlError instanceof Error) {
          console.error("Error stack:", bamlError.stack)
        }
      }
    } else {
      console.log("⚠️  No OPENROUTER_API_KEY found")
    }

    console.log("Error, modals won't be generated")
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  } catch (error) {
    console.error("/api/adam error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
