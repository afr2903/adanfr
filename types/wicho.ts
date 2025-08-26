export type WichoModalType =
  | "resume"
  | "experience"
  | "project"
  | "education"
  | "summary"

export interface WichoModal {
  id: string
  type: WichoModalType
  title: string
  body: string[] | string
  images?: string[]
  linkHref?: string
  linkLabel?: string
  sourceIds?: string[]
}

export interface WichoRequest {
  message: string
}

export interface WichoResponse {
  modals: WichoModal[]
}


