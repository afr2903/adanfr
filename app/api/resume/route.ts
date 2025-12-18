import { NextResponse } from "next/server"
import { experiences } from "@/data/experiences"
import { projects } from "@/data/projects"
import { education } from "@/data/education"
import { b as bamlClient } from "../../../baml_client"
import type { ResumeData, ResumeSection } from "@/types/resume"

// Fallback resume when BAML/LLM is unavailable
function generateFallbackResume(userMessages: string[]): ResumeData {
  const relevantExperiences = experiences.slice(0, 3)
  const relevantProjects = projects.slice(0, 2)

  return {
    contact: {
      name: "Adan Flores Ramirez",
      phone: "+1 (408) 312-1647",
      email: "adan.flores.ramirez@outlook.com",
      linkedin: "linkedin.com/in/afr2903",
      github: "github.com/afr2903",
      website: "adanfr.me",
      location: "Monterrey, Mexico",
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
          {
            category: "Languages",
            skills: ["Python", "TypeScript", "C++", "Go", "C#"],
          },
          {
            category: "Frameworks",
            skills: ["React", "Next.js", "FastAPI", "ROS/ROS2", "PyTorch"],
          },
          {
            category: "Tools",
            skills: ["Docker", "Git", "Linux", "Unity", "BAML"],
          },
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

// Transform BAML response to proper ResumeData format
function transformBAMLResponse(bamlResponse: any): ResumeData {
  const resume = bamlResponse.resume

  // Transform sections to ensure proper typing
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
      name: resume.contact.name,
      phone: resume.contact.phone,
      email: resume.contact.email,
      linkedin: resume.contact.linkedin,
      github: resume.contact.github,
      website: resume.contact.website,
      location: resume.contact.location,
    },
    summary: resume.summary,
    sections: transformedSections,
  }
}

export async function POST(req: Request) {
  try {
    const { userMessages } = (await req.json()) as { userMessages?: string[] }

    if (!userMessages || !Array.isArray(userMessages)) {
      return NextResponse.json({ error: "Invalid request - userMessages required" }, { status: 400 })
    }

    console.log("\n🔵 === RESUME GENERATION REQUEST ===")
    console.log("📩 User messages count:", userMessages.length)
    console.log("🔑 OPENROUTER_API_KEY exists:", !!process.env.OPENROUTER_API_KEY)

    // Try using BAML client if OPENROUTER_API_KEY is set
    if (process.env.OPENROUTER_API_KEY) {
      try {
        console.log("🔄 Preparing context for BAML GenerateResume...")

        // Prepare context strings
        const userMessagesContext = userMessages.join("\n")

        const experiencesContext = experiences
          .map(
            (exp) =>
              `ID: ${exp.id}\n` +
              `Company: ${exp.company}\n` +
              `Role: ${exp.role}\n` +
              `Period: ${exp.period}\n` +
              `Description: ${exp.description}\n` +
              `Details: ${Array.isArray(exp.details.description) ? exp.details.description.join(" ") : exp.details.description}\n` +
              `Location: ${exp.details.location}\n` +
              `Skills: ${exp.details.skills.join(", ")}\n`
          )
          .join("\n---\n")

        const projectsContext = projects
          .map(
            (proj) =>
              `ID: ${proj.id}\n` +
              `Title: ${proj.title}\n` +
              `Category: ${proj.category}\n` +
              `Info: ${Array.isArray(proj.projectInfo) ? proj.projectInfo.join(" ") : proj.projectInfo}\n` +
              `Technologies: ${proj.technologies}\n` +
              `Industry: ${proj.industry}\n` +
              `Client: ${proj.client}\n` +
              `Date: ${proj.date}\n`
          )
          .join("\n---\n")

        const educationContext = education
          .map(
            (edu) =>
              `ID: ${edu.id}\n` +
              `Institution: ${edu.institution}\n` +
              `Degree: ${edu.degree}\n` +
              `Period: ${edu.period}\n` +
              `GPA: ${edu.gpa}\n` +
              `Location: ${edu.location}\n` +
              `Description: ${edu.description.join(" ")}\n` +
              `Coursework: ${edu.coursework?.join(", ") || "N/A"}\n`
          )
          .join("\n---\n")

        console.log("🚀 Calling BAML GenerateResume...")
        const startTime = Date.now()

        const bamlResponse = await bamlClient.GenerateResume(
          userMessagesContext,
          experiencesContext,
          projectsContext,
          educationContext
        )

        const duration = Date.now() - startTime
        console.log(`⏱️  BAML call completed in ${duration}ms`)
        console.log("📦 BAML response received")

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

    // Fallback to heuristic resume generation
    console.log("📝 Using fallback resume generation")
    const fallbackResume = generateFallbackResume(userMessages)
    return NextResponse.json({ resume: fallbackResume })
  } catch (error) {
    console.error("/api/resume error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
