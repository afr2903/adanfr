import { NextResponse } from "next/server"
import { experiences } from "@/data/experiences"
import { projects } from "@/data/projects"
import { education } from "@/data/education"
import type { WichoModal, WichoResponse } from "@/lib/wicho-types"

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

function buildExperienceModal(id: string): WichoModal | null {
  const exp = experiences.find((e) => e.id === id)
  if (!exp) return null
  return {
    id: `experience-${exp.id}`,
    type: "experience",
    title: `${exp.role} — ${exp.company}`,
    body: exp.details.description,
    images: exp.details.images,
    sourceIds: [exp.id],
  }
}

function buildProjectModal(id: string): WichoModal | null {
  const proj = projects.find((p) => p.id === id)
  if (!proj) return null
  return {
    id: `project-${proj.id}`,
    type: "project",
    title: proj.title,
    body: proj.projectInfo,
    images: proj.details?.images,
    sourceIds: [proj.id],
  }
}

function buildEducationModal(id: string): WichoModal | null {
  const edu = education.find((e) => e.id === id)
  if (!edu) return null
  const images = (edu as any).images || (edu as any).image ? [(edu as any).image] : []
  return {
    id: `education-${edu.id}`,
    type: "education",
    title: `${edu.degree} — ${edu.institution}`,
    body: edu.description,
    images: images,
    sourceIds: [edu.id],
  }
}

function buildResumeModal(): WichoModal {
  return {
    id: "resume",
    type: "resume",
    title: "Download Resume (PDF)",
    body: "A tailored resume is ready. Click to download the latest PDF.",
    linkHref: "/Adan_Flores_resume.pdf",
    linkLabel: "Download Resume",
  }
}

function buildSummaryModal(message: string, picked: WichoModal[]): WichoModal {
  const bullets = picked
    .map((m) => `• ${m.title}`)
    .join("\n")
  const body = [
    `Here is a concise response to: \"${message}\"`,
    "The following highlights were selected:",
    bullets,
  ]
  return {
    id: `summary-${Date.now()}`,
    type: "summary",
    title: "How I match your needs",
    body,
  }
}

async function generateModalsHeuristically(message: string): Promise<WichoModal[]> {
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

  const modals: WichoModal[] = []

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

  // Cap at 3
  const capped = modals.slice(0, 3)
  const withSummary = [buildSummaryModal(message, capped), ...capped]
  return withSummary.slice(0, 3)
}

export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as { message?: string }
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Try using BAML client if present (avoid bundling native module)
    try {
      if (process.env.GOOGLE_API_KEY) {
        const dynamicImport = new Function("p", "return import(p)") as (p: string) => Promise<any>
        const baml = await dynamicImport("@/baml_client").catch(() => null)
        if (baml && (baml as any).b) {
          const { b } = baml as any
          const aiResp = await b.GenerateWichoModals(message)
          const asResp: WichoResponse = aiResp
          if (asResp && Array.isArray(asResp.modals) && asResp.modals.length > 0) {
            return NextResponse.json(asResp)
          }
        }
      }
    } catch {}

    // Fallback heuristic
    const modals = await generateModalsHeuristically(message)
    return NextResponse.json({ modals } satisfies WichoResponse)
  } catch (error) {
    console.error("/api/wicho error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}


