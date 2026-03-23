import { getDb } from '@/lib/mongodb'
import type { Experience, Project, Education, PromptDocument } from './types'

// ---------------------------------------------------------------------------
// In-memory cache with TTL (avoids hitting MongoDB on every request/render)
// ---------------------------------------------------------------------------
const cache = new Map<string, { data: unknown; ts: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data as T
  cache.delete(key)
  return null
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, ts: Date.now() })
}

// Strip MongoDB _id and _order from returned documents
function clean<T>(doc: Record<string, unknown>): T {
  const { _id, _order, ...rest } = doc
  return rest as T
}

// ---------------------------------------------------------------------------
// Data fetchers (gracefully return empty if DB unavailable / not seeded yet)
// ---------------------------------------------------------------------------

export async function getExperiences(): Promise<Experience[]> {
  const cached = getCached<Experience[]>('experiences')
  if (cached) return cached
  try {
    const db = await getDb()
    const docs = await db.collection('experiences').find({}).sort({ _order: 1 }).toArray()
    const result = docs.map(d => clean<Experience>(d as unknown as Record<string, unknown>))
    setCache('experiences', result)
    return result
  } catch {
    console.warn('⚠️  Could not fetch experiences from MongoDB — returning empty array')
    return []
  }
}

export async function getProjects(): Promise<Project[]> {
  const cached = getCached<Project[]>('projects')
  if (cached) return cached
  try {
    const db = await getDb()
    const docs = await db.collection('projects').find({}).sort({ _order: 1 }).toArray()
    const result = docs.map(d => clean<Project>(d as unknown as Record<string, unknown>))
    setCache('projects', result)
    return result
  } catch {
    console.warn('⚠️  Could not fetch projects from MongoDB — returning empty array')
    return []
  }
}

export async function getEducation(): Promise<Education[]> {
  const cached = getCached<Education[]>('education')
  if (cached) return cached
  try {
    const db = await getDb()
    const docs = await db.collection('education').find({}).sort({ _order: 1 }).toArray()
    const result = docs.map(d => clean<Education>(d as unknown as Record<string, unknown>))
    setCache('education', result)
    return result
  } catch {
    console.warn('⚠️  Could not fetch education from MongoDB — returning empty array')
    return []
  }
}

export async function getPrompt(key: string): Promise<PromptDocument | null> {
  const cacheKey = `prompt:${key}`
  const cached = getCached<PromptDocument>(cacheKey)
  if (cached) return cached
  try {
    const db = await getDb()
    const doc = await db.collection('prompts').findOne({ key })
    if (!doc) return null
    const result = clean<PromptDocument>(doc as unknown as Record<string, unknown>)
    setCache(cacheKey, result)
    return result
  } catch {
    console.warn(`⚠️  Could not fetch prompt "${key}" from MongoDB`)
    return null
  }
}

// ---------------------------------------------------------------------------
// Context formatting helpers (used by API routes to build LLM context)
// ---------------------------------------------------------------------------

export function formatExperiencesContext(experiences: Experience[]): string {
  return experiences.map(exp =>
    `ID: ${exp.id}\n` +
    `Company: ${exp.company}\n` +
    `Role: ${exp.role}\n` +
    `Period: ${exp.period}\n` +
    `Description: ${exp.description}\n` +
    `Details: ${Array.isArray(exp.details.description) ? exp.details.description.join(' ') : exp.details.description}\n` +
    `Location: ${exp.details.location}\n` +
    `Skills: ${exp.details.skills.join(', ')}\n` +
    `Images: ${exp.details.images.join(', ')}\n`
  ).join('\n---\n')
}

export function formatProjectsContext(projects: Project[]): string {
  return projects.map(proj =>
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
}

export function formatEducationContext(education: Education[]): string {
  return education.map(edu =>
    `ID: ${edu.id}\n` +
    `Institution: ${edu.institution}\n` +
    `Degree: ${edu.degree}\n` +
    `Period: ${edu.period}\n` +
    `GPA: ${edu.gpa}\n` +
    `Location: ${edu.location}\n` +
    `Description: ${edu.description.join(' ')}\n` +
    `Coursework: ${edu.coursework?.join(', ') || 'N/A'}\n`
  ).join('\n---\n')
}

// ---------------------------------------------------------------------------
// Cache invalidation (call after DB updates)
// ---------------------------------------------------------------------------
export function invalidateCache(key?: string) {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}
