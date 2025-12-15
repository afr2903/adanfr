export type AdamModalType = "resume" | "experience" | "project" | "education" | "summary" | "Resume" | "Experience" | "Project" | "Education" | "Summary"

export interface AdamModal {
  id: string
  type: AdamModalType
  title: string
  body?: string | string[]
  reasoning?: string | null
  images?: string[]
  linkHref?: string
  linkLabel?: string
  sourceIds?: string[]
}

export type LensType = 'none' | 'recruiter' | 'collaborator' | 'researcher' | 'founder'

export const LENS_CONTEXTS: Record<LensType, string> = {
  none: '',
  recruiter: '[LENS: Recruiter - emphasize credentials, metrics, titles, company names, years of experience, and quantifiable achievements]',
  collaborator: '[LENS: Collaborator - emphasize technical depth, projects, what excites me, collaboration style, and hands-on skills]',
  researcher: '[LENS: Researcher - emphasize publications, methodologies, research questions, academic background, and open problems I am exploring]',
  founder: '[LENS: Founder - emphasize problem-solving ability, startup experience, market awareness, leadership, and building from scratch]'
}

export interface AdamResponse { modals: AdamModal[] }



