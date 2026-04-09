import { BasePayload, getPayload } from 'payload'
import dotenv from 'dotenv'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import config from '../payload.config.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({
  path: path.resolve(dirname, '../../.env'),
  quiet: true,
})

const createPayload = async () => {
  const payloadConfig = await config
  return getPayload({ config: payloadConfig })
}

const TMDB_TOKEN = process.env.MOVIE_DB_API
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_POSTERS_BUCKET = 'movie'

if (!TMDB_TOKEN) {
  throw new Error('Missing MOVIE_DB_API env var')
}

if (!SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL env var')
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY env var')
}

const tmdbRequestOptions: RequestInit = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_TOKEN}`,
  },
}

type MovieDoc = {
  id: number
  title: string
  unique_id?: null | string
  poster_url?: null | string
}

type TMDBMovieDetails = {
  id: number
  poster_path: null | string
  title: string
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const withRetry = async <T>(
  fn: () => Promise<T>,
  config?: {
    retries?: number
    baseDelayMs?: number
    label?: string
  },
): Promise<T> => {
  const retries = config?.retries ?? 3
  const baseDelayMs = config?.baseDelayMs ?? 750
  const label = config?.label ?? 'request'

  let attempt = 0

  while (true) {
    try {
      return await fn()
    } catch (error) {
      attempt += 1

      if (attempt > retries) {
        console.error(`[${label}] failed after ${attempt} attempts`)
        throw error
      }

      const waitMs = baseDelayMs * 2 ** (attempt - 1)
      console.warn(`[${label}] attempt ${attempt} failed, retrying in ${waitMs}ms...`)
      await sleep(waitMs)
    }
  }
}

const fetchMovieDetails = async (tmdbMovieId: string) => {
  return withRetry(
    async (): Promise<TMDBMovieDetails> => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbMovieId}?language=en-US`,
        tmdbRequestOptions,
      )

      if (!response.ok) {
        throw new Error(
          `TMDB movie details failed for movie ${tmdbMovieId}: ${response.status} ${response.statusText}`,
        )
      }

      return response.json()
    },
    { label: `TMDB details movieId=${tmdbMovieId}` },
  )
}

const downloadPoster = async (posterPath: string) => {
  return withRetry(
    async () => {
      const response = await fetch(`https://image.tmdb.org/t/p/original${posterPath}`)

      if (!response.ok) {
        throw new Error(
          `TMDB poster download failed for path ${posterPath}: ${response.status} ${response.statusText}`,
        )
      }

      const arrayBuffer = await response.arrayBuffer()
      const contentType = response.headers.get('content-type') ?? 'image/jpeg'

      return {
        buffer: Buffer.from(arrayBuffer),
        contentType,
      }
    },
    { label: `TMDB poster path=${posterPath}` },
  )
}

const convertPosterToWebp = async (posterBuffer: Buffer) => {
  return sharp(posterBuffer).webp().toBuffer()
}

const encodeStoragePath = (value: string) => value.split('/').map(encodeURIComponent).join('/')

const buildPublicPosterUrl = (objectPath: string) => {
  const normalizedBaseUrl = SUPABASE_URL.replace(/\/$/, '')
  return `${normalizedBaseUrl}/storage/v1/object/public/${SUPABASE_POSTERS_BUCKET}/${encodeStoragePath(objectPath)}`
}

const uploadPosterToSupabase = async (args: {
  contentType: string
  fileName: string
  objectPath: string
  posterBuffer: Buffer
}) => {
  const normalizedBaseUrl = SUPABASE_URL.replace(/\/$/, '')
  const uploadUrl = `${normalizedBaseUrl}/storage/v1/object/${SUPABASE_POSTERS_BUCKET}/${encodeStoragePath(args.objectPath)}`

  await withRetry(
    async () => {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          'content-type': args.contentType,
          'x-upsert': 'true',
        },
        body: args.posterBuffer,
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(`Supabase upload failed: ${response.status} ${response.statusText} - ${message}`)
      }
    },
    { label: `Supabase upload ${args.fileName}` },
  )

  return buildPublicPosterUrl(args.objectPath)
}

const findMoviesWithoutPosters = async (payload: BasePayload) => {
  const movies: MovieDoc[] = []
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const result = await payload.find({
      collection: 'Content',
      depth: 0,
      limit: 100,
      page,
      select: {
        id: true,
        poster_url: true,
        title: true,
        unique_id: true,
      },
      where: {
        and: [
          {
            category: {
              equals: 'movies',
            },
          },
          {
            or: [
              {
                poster_url: {
                  exists: false,
                },
              },
              {
                poster_url: {
                  equals: null,
                },
              },
            ],
          },
        ],
      },
    })

    movies.push(...(result.docs as MovieDoc[]))
    hasNextPage = result.hasNextPage
    page += 1
  }

  return movies
}

const startSyncMoviePosters = async () => {
  const payload = await createPayload()
  const DELAY_BETWEEN_MOVIES_MS = 300

  console.log('\nStarting movie poster sync...\n')

  const movies = await findMoviesWithoutPosters(payload)
  console.log(`Found ${movies.length} movie records without posters.\n`)

  let uploadedCount = 0
  let skippedCount = 0
  let failedCount = 0

  for (const movie of movies) {
    const tmdbMovieId = movie.unique_id

    console.log(`Processing "${movie.title}" (contentId=${movie.id}, tmdbId=${tmdbMovieId ?? 'missing'})`)

    if (!tmdbMovieId) {
      console.warn('Skipping because unique_id is missing.')
      skippedCount += 1
      continue
    }

    try {
      const details = await fetchMovieDetails(tmdbMovieId)

      if (!details.poster_path) {
        console.warn('Skipping because TMDB has no poster_path for this movie.')
        skippedCount += 1
        continue
      }

      const poster = await downloadPoster(details.poster_path)
      const webpPosterBuffer = await convertPosterToWebp(poster.buffer)
      const fileName = `${tmdbMovieId}.webp`
      const objectPath = fileName

      const posterUrl = await uploadPosterToSupabase({
        contentType: 'image/webp',
        fileName,
        objectPath,
        posterBuffer: webpPosterBuffer,
      })

      await payload.update({
        collection: 'Content',
        id: movie.id,
        data: {
          poster_url: posterUrl,
        },
      })

      uploadedCount += 1
      console.log(`Uploaded poster to Supabase and saved URL.`)
    } catch (error) {
      failedCount += 1
      console.error(`Failed syncing poster for "${movie.title}" (${tmdbMovieId})`, error)
    }

    await sleep(DELAY_BETWEEN_MOVIES_MS)
  }

  console.log('\nPoster sync finished.')
  console.log(`Uploaded: ${uploadedCount}`)
  console.log(`Skipped: ${skippedCount}`)
  console.log(`Failed: ${failedCount}\n`)
}

void startSyncMoviePosters()
