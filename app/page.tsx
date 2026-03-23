import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import PortfolioSection from "@/components/portfolio-section"
import ExperienceSection from "@/components/experience-section"
import EducationSection from "@/components/education-section"
import SkillsSection from "@/components/skills-section"
import ContactSection from "@/components/contact-section"
import { getExperiences, getProjects, getEducation } from "@/lib/db/content"

export default async function Home() {
  const [experiences, projects, education] = await Promise.all([
    getExperiences(),
    getProjects(),
    getEducation(),
  ])

  return (
    <>
      <HeroSection />
      <AboutSection />
      <PortfolioSection projects={projects} />
      <ExperienceSection experiences={experiences} />
      <EducationSection education={education} />
      <SkillsSection />
      <ContactSection />
    </>
  )
}
