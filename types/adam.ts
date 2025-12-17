export type AdamModalType =
  | "resume"
  | "experience"
  | "project"
  | "education"
  | "summary"

export interface AdamModal {
  id: string
  type: AdamModalType
  title: string
  body: string[] | string
  images?: string[]
  linkHref?: string
  linkLabel?: string
  sourceIds?: string[]
}

export interface AdamRequest {
  message: string
}

export interface AdamResponse {
  modals: AdamModal[]
}


