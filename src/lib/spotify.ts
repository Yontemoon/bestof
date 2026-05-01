'use server'

import { TAlbum } from '@/types/spotify'
import { BasePayload } from 'payload'
import { createPayload } from '@/utils/payload'
import { slugify } from './utils'
import { Creator } from '@/payload-types'
import sharp from 'sharp'

const findCreator = async (payload: BasePayload, creator_id: string) => {
  const result = await payload.find({
    collection: 'creator',
    limit: 1,
    where: {
      unique_id: {
        equals: creator_id,
      },
    },
  })

  return result?.docs?.[0] ?? null
}

const getSpotifyToken = async () => {
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: SPOTIFY_CLIENT_ID!,
      client_secret: SPOTIFY_CLIENT_SECRET!,
    }),
  })
  const data = (await res.json()) as {
    access_token: string
    token_type: 'Bearer'
    expires_in: 3600
  }
  return data
}

const SPOTIFY_API_URL = `https://api.spotify.com/v1`

const searchSpotifyAlbums = async (term: string) => {
  const tokenData = await getSpotifyToken()

  // search album term with token
  const res = await fetch(`${SPOTIFY_API_URL}/search?q=${term}&type=album`, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  })
  const data = await res.json()
  console.log(data)
  return data
}

const addSpotifyAlbumAndCreator = async (album_id: string) => {
  // Get Token
  const tokenData = await getSpotifyToken()
  const artists: Creator[] = []
  let mediaId: number | null = null
  // search album term with token
  const res = await fetch(`${SPOTIFY_API_URL}/albums/${album_id}`, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  })
  const data = (await res.json()) as TAlbum

  const payload = await createPayload()

  for (const artistId of data.artists) {
    const existingCreator = await findCreator(payload, artistId.id)

    if (!existingCreator) {
      const createdCreator = await payload.create({
        collection: 'creator',
        data: {
          category: 'albums',
          unique_id: artistId.id.toString(),
          creator: artistId.name,
          slug: slugify(`${artistId.name}`),
        },
      })
      console.log(createdCreator)
      artists.push(createdCreator)
    } else {
      artists.push(existingCreator)
      console.warn(`Artist ${artistId.name} is already in the database!`)
    }
  }

  const coverImage = data.images?.[0]

  const createdNewAlbum = await payload.create({
    collection: 'Content',
    data: {
      category: 'albums',
      title: data.name,
      slug: slugify(`${data.name}`),
      unique_id: data.id,
      creator: artists.map((artist) => artist.id),
    },
  })

  console.log(createdNewAlbum)

  if (coverImage?.url) {
    const imageRes = await fetch(coverImage.url)

    if (imageRes.ok) {
      const imageBlob = await imageRes.blob()
      const arrayBuffer = await imageBlob.arrayBuffer()
      const inputBuffer = Buffer.from(arrayBuffer)

      // --- Conversion Logic ---
      // Use sharp to convert the buffer to webp
      const webpBuffer = await sharp(inputBuffer)
        .webp({ quality: 80 }) // You can adjust quality here (0-100)
        .toBuffer()

      const fileName = `album-${createdNewAlbum.id}.webp`
      // ------------------------

      const mediaRes = await payload.create({
        collection: 'media',
        data: {
          alt: `album-${createdNewAlbum.id}`,
        },
        file: {
          data: webpBuffer,
          mimetype: 'image/webp', // Always webp
          name: fileName,
          size: webpBuffer.byteLength,
        },
      })

      if (mediaRes) {
        await payload.update({
          collection: 'Content',
          id: createdNewAlbum.id,
          data: {
            media: mediaRes.id,
          },
        })
      }
    }
  }

  return data

  // Get results
  // Get album details and also get creator(s) of album
  // store the creator information in the creator collection if not exist and get the id
  // store the album information in the content collection with the creator id and category as music if not exist
}

export { addSpotifyAlbumAndCreator, getSpotifyToken, searchSpotifyAlbums }
