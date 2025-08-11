import { experiences } from "@/data/experiences"
import fs from "fs"
import path from "path"

export function addNewExperience(newExperience: any) {
  // In a real application, you would validate the input
  const updatedExperiences = [newExperience, ...experiences]

  // In a production environment, you might want to:
  // 1. Save to a database instead of a file
  // 2. Use a CMS like Contentful, Sanity, or Strapi
  // 3. Implement proper error handling

  // This is a simplified example for local development
  const filePath = path.join(process.cwd(), "data", "experiences.ts")
  const fileContent = `export const experiences = ${JSON.stringify(updatedExperiences, null, 2)}`

  try {
    fs.writeFileSync(filePath, fileContent)
    return { success: true }
  } catch (error) {
    console.error("Error saving experience:", error)
    return { success: false, error }
  }
}
