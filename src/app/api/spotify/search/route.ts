import { searchSpotifyAlbums } from '@/lib/spotify'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const query = request.nextUrl.searchParams.get('query')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const results = await searchSpotifyAlbums(query)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching Spotify token:', error)
    return NextResponse.json({ error: 'Failed to fetch Spotify token' }, { status: 500 })
  }
}
