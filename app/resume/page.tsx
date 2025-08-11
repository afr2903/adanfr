import ExperienceSection from "@/components/experience-section"
import EducationSection from "@/components/education-section"
import SkillsSection from "@/components/skills-section"

export default function ResumePage() {
  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 mb-16">
        <h1 className="text-6xl font-bold text-center relative">
          <span className="opacity-5 absolute inset-0 flex items-center justify-center text-8xl">RESUME</span>
          My Experience
          <span className="block h-1 w-24 bg-primary/70 mx-auto mt-4"></span>
        </h1>
      </div>

      <ExperienceSection />
      <EducationSection />
      <SkillsSection />

      <div className="flex justify-center my-16">
        <a
          href="/Adan_Flores_resume.pdf"
          download
          className="px-8 py-3 bg-primary hover:bg-primary-700 text-white rounded-full transition-colors flex items-center gap-2"
        >
          Download CV
        </a>
      </div>
    </div>
  )
}
