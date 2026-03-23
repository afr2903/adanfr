import PortfolioSection from "@/components/portfolio-section"
import { getProjects } from "@/lib/db/content"

export default async function PortfolioPage() {
  const projects = await getProjects()

  return (
    <div className="pt-24">
      <PortfolioSection projects={projects} />
    </div>
  )
}
