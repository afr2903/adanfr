// Resume Types for Dynamic Resume Generation

export interface ResumeContact {
  name: string
  phone?: string
  email?: string
  linkedin?: string
  github?: string
  website?: string
  location?: string
  customLinks?: { label: string; url: string }[]
}

export interface EducationItem {
  institution: string
  location?: string
  degree: string
  dates: string
  gpa?: string
  highlights?: string[]
}

export interface ExperienceItem {
  title: string
  dates: string
  organization: string
  location?: string
  bullets: string[]
}

export interface PublicationItem {
  authors: string
  title: string
  venue: string
  status?: "Published" | "Accepted" | "Under review"
  award?: string
}

export interface SkillCategory {
  category: string
  skills: string[]
}

export interface ProjectItem {
  title: string
  dates?: string
  organization?: string
  description: string
  technologies?: string[]
  url?: string
}

export type ResumeSectionType = "education" | "experience" | "publications" | "skills" | "projects"

export interface EducationSection {
  type: "education"
  title: string
  items: EducationItem[]
}

export interface ExperienceSection {
  type: "experience"
  title: string
  items: ExperienceItem[]
}

export interface PublicationsSection {
  type: "publications"
  title: string
  items: PublicationItem[]
}

export interface SkillsSection {
  type: "skills"
  title: string
  items: SkillCategory[]
}

export interface ProjectsSection {
  type: "projects"
  title: string
  items: ProjectItem[]
}

export type ResumeSection =
  | EducationSection
  | ExperienceSection
  | PublicationsSection
  | SkillsSection
  | ProjectsSection

export interface ResumeData {
  contact: ResumeContact
  summary?: string
  sections: ResumeSection[]
}

// Response type from the BAML function
export interface GenerateResumeResponse {
  resume: ResumeData
}
