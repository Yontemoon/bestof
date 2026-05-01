import { NextRequest, NextResponse } from 'next/server'
import { tmdbFetchWrapper } from '@/lib/tmdb'
import { TMovieSearch } from '@/types'

export const GET = async (request: NextRequest) => {
  try {
    const query = request.nextUrl.searchParams.get('query')
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required.' }, { status: 400 })
    }

    const results = await tmdbFetchWrapper<{ results: TMovieSearch[] }>(
      `/search/movie?include_adult=false&language=en-US&page=1&query=${query}`,
    )

    return NextResponse.json({ results: results.results })
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while processing the request.' },
      { status: 500 },
    )
  }
}
