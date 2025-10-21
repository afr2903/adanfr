export type AdamModalType = "resume" | "experience" | "project" | "education" | "summary" | "Resume" | "Experience" | "Project" | "Education" | "Summary"

export interface AdamModal {
  id: string
  type: AdamModalType
  title: string
  body?: string | string[]
  images?: string[]
  linkHref?: string
  linkLabel?: string
  sourceIds?: string[]
}

export interface AdamResponse { modals: AdamModal[] }



