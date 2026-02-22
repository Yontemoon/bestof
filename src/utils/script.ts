// import { createPayload } from './payload.js'
import { BasePayload, getPayload } from 'payload'
import { slugify } from '../lib/utils.js'
import dotenv from 'dotenv'
import config from '../payload.config.js'
import { Creator } from '@/payload-types.js'

const createPayload = async () => {
  const payloadConfig = await config
  return getPayload({ config: payloadConfig })
}

dotenv.config()

const TMDB_TOKEN = process.env.MOVIE_DB_API
console.log(TMDB_TOKEN)

if (!TMDB_TOKEN) {
  throw new Error('Missing MOVIE_DB_API env var')
}

const options: RequestInit = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_TOKEN}`,
  },
}

type TMDBDiscoverResponse = {
  page: number
  total_pages: number
  results: Array<{
    id: number
    title: string
  }>
}

type TMDBCreditsResponse = {
  crew: Array<{
    id: number
    name: string
    job: string
  }>
}

/** --- Rate limit helpers --- */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Basic retry wrapper with exponential backoff.
 * Useful for 429 / temporary TMDB issues.
 */
const withRetry = async <T>(
  fn: () => Promise<T>,
  config?: {
    retries?: number
    baseDelayMs?: number
    label?: string
  },
): Promise<T> => {
  const retries = config?.retries ?? 3
  const baseDelayMs = config?.baseDelayMs ?? 600
  const label = config?.label ?? 'request'

  let attempt = 0
  while (true) {
    try {
      return await fn()
    } catch (err) {
      attempt++

      if (attempt > retries) {
        console.error(`[${label}] failed after ${attempt} attempts`)
        throw err
      }

      const waitMs = baseDelayMs * 2 ** (attempt - 1)
      console.warn(`[${label}] attempt ${attempt} failed, retrying in ${waitMs}ms...`)
      await sleep(waitMs)
    }
  }
}

const fetchMovieData = async (page: number): Promise<TMDBDiscoverResponse> => {
  return withRetry(
    async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_year=2025&sort_by=popularity.desc`,
        options,
      )

      if (!res.ok) {
        throw new Error(`TMDB discover failed: ${res.status} ${res.statusText}`)
      }

      return res.json()
    },
    { label: `TMDB discover page=${page}` },
  )
}

const fetchCredits = async (movieId: number): Promise<TMDBCreditsResponse> => {
  return withRetry(
    async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
        options,
      )

      if (!res.ok) {
        throw new Error(`TMDB credits failed for movie ${movieId}: ${res.status} ${res.statusText}`)
      }

      return res.json()
    },
    { label: `TMDB credits movieId=${movieId}` },
  )
}

/** --- Payload helpers --- */
const findCreatorByTmdbId = async (payload: BasePayload, tmdbId: number) => {
  const result = await payload.find({
    collection: 'creator',
    limit: 1,
    where: {
      unique_id: {
        equals: tmdbId,
      },
    },
  })

  return result?.docs?.[0] ?? null
}

const findContentByTmdbId = async (payload: BasePayload, tmdbId: number) => {
  const result = await payload.find({
    collection: 'Content',
    limit: 1,
    where: {
      unique_id: {
        equals: tmdbId,
      },
    },
  })

  return result?.docs?.[0] ?? null
}

const startFetchMovieScripts = async () => {
  const payload = await createPayload()

  // Tune these based on how aggressive you want to be
  const DELAY_BETWEEN_MOVIES_MS = 250
  const DELAY_BETWEEN_CREDITS_CALLS_MS = 250
  const DELAY_BETWEEN_PAGES_MS = 1000

  let page = 1
  let totalCreatedCreators = 0
  let totalCreatedContent = 0

  console.log(`\n🎬 Starting TMDB import for year 2025...\n`)

  while (true) {
    console.log(`📄 Fetching TMDB page ${page}...`)
    const movies = await fetchMovieData(page)

    if (!movies?.results?.length) {
      console.log(`✅ No results returned. Stopping.`)
      break
    }

    console.log(`📦 Page ${movies.page}/${movies.total_pages} — ${movies.results.length} movies`)

    if (page > movies.total_pages) {
      console.log(`✅ Reached end of pages. Stopping.`)
      break
    }

    for (const movie of movies.results) {
      console.log(`\n🎞️ Movie: ${movie.title} (${movie.id})`)

      try {
        // Skip if already imported
        const existingContent = await findContentByTmdbId(payload, movie.id)
        if (existingContent) {
          console.log(`↩️ Skipping (already exists in Payload)`)
          continue
        }

        // Credits request (rate limit safe)
        await sleep(DELAY_BETWEEN_CREDITS_CALLS_MS)
        const credits = await fetchCredits(movie.id)

        const directors = credits.crew.filter((m) => m.job === 'Director')

        if (!directors.length) {
          console.log(`⚠️ No directors found. Creating content without creator.`)
        } else {
          console.log(`🎬 Directors: ${directors.map((d) => d.name).join(', ')}`)
        }

        // Ensure creators exist and collect Payload relationship IDs
        const creators: Creator[] = []

        for (const director of directors) {
          const existingCreator = await findCreatorByTmdbId(payload, director.id)

          if (!existingCreator) {
            console.log(`➕ Creating creator: ${director.name} (${director.id})`)

            const created = await payload.create({
              collection: 'creator',
              data: {
                id: director.id,
                category: 'movies',
                unique_id: director.id.toString(),
                creator: director.name,
                slug: slugify(`${director.name}`),
              },
            })

            totalCreatedCreators++
            creators.push(created)
          } else {
            console.log(`✅ Creator exists: ${director.name} (${director.id})`)
            creators.push(existingCreator)
          }
        }

        // Create Content
        console.log(`📝 Creating content: ${movie.title}`)

        await payload.create({
          collection: 'Content',
          data: {
            category: 'movies',
            id: movie.id,
            title: movie.title,
            slug: slugify(`${movie.title}`),
            unique_id: movie.id.toString(),
            creator: creators.map((creator) => creator.id),
          },
        })

        totalCreatedContent++

        // slow down between movies
        await sleep(DELAY_BETWEEN_MOVIES_MS)
      } catch (err) {
        console.error(`❌ Failed processing movie ${movie.id} (${movie.title})`, err)
      }
    }

    page++

    console.log(
      `\n📊 Progress so far — creators created: ${totalCreatedCreators}, content created: ${totalCreatedContent}\n`,
    )

    await sleep(DELAY_BETWEEN_PAGES_MS)
  }

  console.log(`\n🏁 Done!`)
  console.log(`✅ Total creators created: ${totalCreatedCreators}`)
  console.log(`✅ Total content created: ${totalCreatedContent}\n`)
}

void startFetchMovieScripts()
