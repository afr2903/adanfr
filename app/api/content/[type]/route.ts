import { NextResponse } from 'next/server'
import { getExperiences, getProjects, getEducation } from '@/lib/db/content'

const VALID_TYPES = ['experiences', 'projects', 'education'] as const

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params

  if (!VALID_TYPES.includes(type as typeof VALID_TYPES[number])) {
    return NextResponse.json({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` }, { status: 400 })
  }

  try {
    let data
    switch (type) {
      case 'experiences':
        data = await getExperiences()
        break
      case 'projects':
        data = await getProjects()
        break
      case 'education':
        data = await getEducation()
        break
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error(`/api/content/${type} error:`, error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}
