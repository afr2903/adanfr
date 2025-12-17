import { NextResponse } from "next/server"
import { experiences } from "@/data/experiences"
import { projects } from "@/data/projects"
import { education } from "@/data/education"
import type { AdamModal, AdamResponse } from "@/lib/adam-types"
import { b as bamlClient } from "../../../baml_client"

function normalizeText(value: unknown): string {
  if (value == null) return ""
  if (Array.isArray(value)) return value.map((v) => normalizeText(v)).join("\n")
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).map(normalizeText).join("\n")
  return String(value)
}

function scoreRelevance(haystack: string, queryTokens: string[]): number {
  const lower = haystack.toLowerCase()
  let score = 0
  for (const token of queryTokens) {
    if (token.length < 3) continue
    if (lower.includes(token)) score += 1
  }
  return score
}

function rankByRelevance<T extends { id: string }>(items: T[], queryTokens: string[], textGetter: (item: T) => string): T[] {
  return [...items]
    .map((item) => ({ item, score: scoreRelevance(textGetter(item), queryTokens) }))
    .sort((a, b) => b.score - a.score)
    .filter((x) => x.score > 0)
    .map((x) => x.item)
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

function buildResumeModal(): AdamModal {
  return {
    id: "resume",
    type: "resume",
    title: "Download Resume (PDF)",
    body: "A tailored resume is ready. Click to download the latest PDF.",
    linkHref: "/Adan_Flores_resume.pdf",
    linkLabel: "Download Resume",
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

async function generateModalsHeuristically(message: string): Promise<AdamModal[]> {
  const tokens = message
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)

  const rankedExperiences = rankByRelevance(experiences as any, tokens, (e: any) =>
    normalizeText({ company: e.company, role: e.role, description: e.description, details: e.details })
  )
  const rankedProjects = rankByRelevance(projects as any, tokens, (p: any) =>
    normalizeText({ title: p.title, projectInfo: p.projectInfo, technologies: p.technologies, industry: p.industry })
  )
  const rankedEducation = rankByRelevance(education as any, tokens, (ed: any) =>
    normalizeText({ institution: ed.institution, degree: ed.degree, description: ed.description, coursework: ed.coursework })
  )

  const modals: AdamModal[] = []

  // Always offer resume as one of the modals
  modals.push(buildResumeModal())

  if (rankedExperiences[0]) {
    const m = buildExperienceModal((rankedExperiences[0] as any).id)
    if (m) modals.push(m)
  }
  if (rankedProjects[0]) {
    const m = buildProjectModal((rankedProjects[0] as any).id)
    if (m) modals.push(m)
  } else if (rankedEducation[0]) {
    const m = buildEducationModal((rankedEducation[0] as any).id)
    if (m) modals.push(m)
  }

  // Cap at 4
  const capped = modals.slice(0, 4)
  const withSummary = [buildSummaryModal(message, capped), ...capped]
  return withSummary.slice(0, 4)
}

export async function POST(req: Request) {
  try {
    const { message, history } = (await req.json()) as { message?: string; history?: string[] }
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
            `URLs: ${proj.urls?.map(url => url.name).join(', ')}\n`
          ).join('\n---\n')

        console.log("📊 Context prepared - Experiences:", experiences.length, "Projects:", projects.length)
        console.log("🚀 Calling BAML GenerateAdamModals...")

        const startTime = Date.now()
        const aiResp = await bamlClient.GenerateAdamModals(message, experiencesContext, projectsContext, conversationHistory)
        const duration = Date.now() - startTime

        console.log(`⏱️  BAML call completed in ${duration}ms`)
        console.log("📦 Raw BAML response:", JSON.stringify(aiResp, null, 2))

        const asResp: AdamResponse = aiResp

        if (asResp && Array.isArray(asResp.modals) && asResp.modals.length > 0) {
          console.log("✅ BAML response generated successfully")
          console.log("📋 Number of modals:", asResp.modals.length)
          console.log("📋 Modal types:", asResp.modals.map(m => m.type).join(", "))
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
    console.log("Using heuristic fallback")
    const modals = await generateModalsHeuristically(message)
    return NextResponse.json({ modals } satisfies AdamResponse)
  } catch (error) {
    console.error("/api/adam error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}


