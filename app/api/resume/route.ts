import { NextResponse } from "next/server"
import {
  getExperiences,
  getProjects,
  getEducation,
  getPrompt,
  formatExperiencesContext,
  formatProjectsContext,
  formatEducationContext,
} from "@/lib/db/content"
import { b as bamlClient } from "../../../baml_client"
import type { ResumeData, ResumeSection } from "@/types/resume"

// ---------------------------------------------------------------------------
// Fallback resume when BAML/LLM is unavailable
// ---------------------------------------------------------------------------
async function generateFallbackResume(userMessages: string[]): Promise<ResumeData> {
  const [experiences, projects, education] = await Promise.all([
    getExperiences(),
    getProjects(),
    getEducation(),
  ])
  const relevantExperiences = experiences.slice(0, 3)
  const relevantProjects = projects.slice(0, 2)

  return {
    contact: {
      name: "Adán Flores Ramírez",
      phone: "+1 (408) 312-1647",
      email: "afr102903@gmail.com",
      linkedin: "linkedin.com/in/afr2903",
      github: "github.com/afr2903",
      website: "adanfr.com",
      location: "San Luis Potosí, Mexico",
    },
    summary: userMessages.length > 0
      ? `Software engineer with experience in robotics, AI, and full-stack development. Seeking opportunities aligned with: ${userMessages.slice(-1)[0].substring(0, 100)}...`
      : undefined,
    sections: [
      {
        type: "education",
        title: "Education",
        items: education.map((edu) => ({
          institution: edu.institution,
          location: edu.location,
          degree: edu.degree,
          dates: edu.period,
          gpa: edu.gpa,
          highlights: edu.description,
        })),
      } as ResumeSection,
      {
        type: "experience",
        title: "Experience",
        items: relevantExperiences.map((exp) => ({
          title: exp.role,
          dates: exp.period,
          organization: exp.company,
          location: exp.details.location,
          bullets: exp.details.description.slice(0, 4),
        })),
      } as ResumeSection,
      {
        type: "skills",
        title: "Technical Skills",
        items: [
          { category: "Languages", skills: ["Python", "TypeScript", "C++", "Go", "C#"] },
          { category: "Frameworks", skills: ["React", "Next.js", "FastAPI", "ROS/ROS2", "PyTorch"] },
          { category: "Tools", skills: ["Docker", "Git", "Linux", "Unity", "BAML"] },
        ],
      } as ResumeSection,
      {
        type: "projects",
        title: "Selected Projects",
        items: relevantProjects.map((proj) => ({
          title: proj.title,
          dates: proj.date,
          organization: proj.client,
          description: Array.isArray(proj.projectInfo) ? proj.projectInfo[0] : proj.projectInfo,
          technologies: proj.technologies?.split(",").map((t: string) => t.trim()).slice(0, 5),
        })),
      } as ResumeSection,
    ],
  }
}

// ---------------------------------------------------------------------------
// Transform BAML response to ResumeData
// ---------------------------------------------------------------------------
function transformBAMLResponse(bamlResponse: any): ResumeData {
  const resume = bamlResponse.resume

  const transformedSections: ResumeSection[] = resume.sections.map((section: any) => {
    const type = section.type.toLowerCase()
    switch (type) {
      case "education":
        return {
          type: "education",
          title: section.title,
          items: section.items.map((item: any) => ({
            institution: item.institution,
            location: item.location,
            degree: item.degree,
            dates: item.dates,
            gpa: item.gpa,
            highlights: item.highlights,
          })),
        }
      case "experience":
        return {
          type: "experience",
          title: section.title,
          items: section.items.map((item: any) => ({
            title: item.title,
            dates: item.dates,
            organization: item.organization,
            location: item.location,
            bullets: item.bullets || [],
          })),
        }
      case "skills":
        return {
          type: "skills",
          title: section.title,
          items: section.items.map((item: any) => ({
            category: item.category,
            skills: item.skills || [],
          })),
        }
      case "projects":
        return {
          type: "projects",
          title: section.title,
          items: section.items.map((item: any) => ({
            title: item.title,
            dates: item.dates,
            organization: item.organization,
            description: item.description,
            technologies: item.technologies,
          })),
        }
      case "publications":
        return {
          type: "publications",
          title: section.title,
          items: section.items.map((item: any) => ({
            authors: item.authors,
            title: item.title,
            venue: item.venue,
            status: item.status,
            award: item.award,
          })),
        }
      default:
        return section
    }
  })

  return {
    contact: {
      name: "Adán Flores Ramírez",
      phone: "+1 (408) 312-1647",
      email: "afr102903@gmail.com",
      linkedin: "linkedin.com/in/adanfr",
      github: "github.com/afr2903",
      website: "adanfr.com",
      location: "San Luis Potosí, Mexico",
    },
    summary: resume.summary,
    sections: transformedSections,
  }
}

// ---------------------------------------------------------------------------
// Prompt assembly — builds the full system prompt from DB content + data
// ---------------------------------------------------------------------------
async function assembleResumeSystemPrompt(
  lens: string,
  experiencesContext: string,
  projectsContext: string,
  educationContext: string,
): Promise<string> {
  const prompt = await getPrompt('resume_prompt')
  if (!prompt) throw new Error('resume_prompt not found in database — run the seed script first')

  const lensText = (lens && lens !== 'none' && prompt.lens[lens])
    ? `The visitor is viewing your portfolio through the ${lens} lens. Adjust section priority and bullet point framing:\n${prompt.lens[lens]}`
    : '// DEFAULT LENS\n- **Strategy:** Balanced profile showing Engineering + Research + Leadership.\n- **Section Order:** Education -> Experience -> Skills -> Projects.'

  return [
    prompt.base_prompt,
    `\n<viewpoint_lens>\n${lensText}\n</viewpoint_lens>`,
    `\n<available_experiences>\n${experiencesContext}\n</available_experiences>`,
    `\n<available_projects>\n${projectsContext}\n</available_projects>`,
    `\n<available_education>\n${educationContext}\n</available_education>`,
  ].join('\n')
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const { userMessages, lens } = (await req.json()) as { userMessages?: string[]; lens?: string }

    if (!userMessages || !Array.isArray(userMessages)) {
      return NextResponse.json({ error: "Invalid request - userMessages required" }, { status: 400 })
    }

    console.log("\n🔵 === RESUME GENERATION REQUEST ===")
    console.log("📩 User messages count:", userMessages.length)
    console.log("🔑 OPENROUTER_API_KEY exists:", !!process.env.OPENROUTER_API_KEY)

    if (process.env.OPENROUTER_API_KEY) {
      try {
        console.log("🔄 Preparing context for resume generation...")

        const [experiences, projects, education] = await Promise.all([
          getExperiences(),
          getProjects(),
          getEducation(),
        ])

        const experiencesContext = formatExperiencesContext(experiences)
        const projectsContext = formatProjectsContext(projects)
        const educationContext = formatEducationContext(education)

        const systemPrompt = await assembleResumeSystemPrompt(
          lens || 'none',
          experiencesContext,
          projectsContext,
          educationContext,
        )

        const userMessagesContext = userMessages.join("\n")

        console.log("🚀 Calling BAML GenerateResume...")
        const startTime = Date.now()

        const bamlResponse = await bamlClient.GenerateResume(
          systemPrompt,
          userMessagesContext,
        )

        const duration = Date.now() - startTime
        console.log(`⏱️  BAML call completed in ${duration}ms`)

        if (bamlResponse && bamlResponse.resume) {
          const resumeData = transformBAMLResponse(bamlResponse)
          console.log("✅ Resume generated successfully with", resumeData.sections.length, "sections")
          return NextResponse.json({ resume: resumeData })
        } else {
          console.log("⚠️  BAML response invalid, falling back to heuristics")
        }
      } catch (bamlError) {
        console.error("❌ BAML error, falling back to heuristics:")
        console.error(bamlError)
      }
    } else {
      console.log("⚠️  No OPENROUTER_API_KEY found, using fallback")
    }

    console.log("📝 Using fallback resume generation")
    const fallbackResume = await generateFallbackResume(userMessages)
    return NextResponse.json({ resume: fallbackResume })
  } catch (error) {
    console.error("/api/resume error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
