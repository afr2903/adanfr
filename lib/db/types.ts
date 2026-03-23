// Shared TypeScript types for portfolio content stored in MongoDB

export interface Experience {
  id: string
  logo: string
  company: string
  role: string
  period: string
  description: string
  details: {
    description: string[]
    organization: string
    period: string
    location: string
    skills: string[]
    images: string[]
  }
  client?: string
  industry?: string
  urls?: UrlEntry[]
}

export interface Project {
  id: string
  title: string
  category: string
  image: string
  projectInfo: string[]
  client: string
  technologies: string
  industry: string
  date: string
  details: {
    images: string[]
  }
  urls: UrlEntry[]
}

export interface Education {
  id: string
  logo?: string
  institution: string
  degree: string
  period: string
  gpa: string
  location: string
  images: string[]
  description: string[]
  coursework: string[]
}

export interface UrlEntry {
  icon: string
  name: string
  link: string
}

export interface PromptDocument {
  key: string
  base_prompt: string
  lens: Record<string, string>
}
