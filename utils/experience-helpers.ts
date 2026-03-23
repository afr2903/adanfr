import { getDb } from "@/lib/mongodb"
import type { Experience } from "@/lib/db/types"
import { invalidateCache } from "@/lib/db/content"

export async function addNewExperience(newExperience: Experience) {
  const db = await getDb()
  const count = await db.collection('experiences').countDocuments()
  await db.collection('experiences').insertOne({
    ...newExperience,
    _order: count,
  })
  invalidateCache('experiences')
  return { success: true }
}
