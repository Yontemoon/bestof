import { NextRequest, NextResponse } from 'next/server'
import { createPayload } from '@/utils/payload'
import { tmdbFetchWrapper } from '@/lib/tmdb'
import { TCredits } from '@/types/tmdb'

export const POST = async (request: NextRequest) => {
  try {
    const { id } = await request.json()

    const credits = await tmdbFetchWrapper<TCredits>(`/movie/${id}/credits?language=en-US`)

    const directors = credits.crew.filter((m) => m.job === 'Director')

    console.log(directors)
    const payload = await createPayload()

    directors.forEach(async (director) => {
      const existingDirector = await payload.find({
        collection: 'creator',
        where: {
          unique_id: {
            equals: director.id.toString(),
          },
        },
      })

      const dirDocs = existingDirector.docs
    })

    return NextResponse.json({ directors })
  } catch (error) {
    console.error('Error in /api/tmdb/add:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
