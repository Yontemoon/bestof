'use client'

import React, { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@uidotdev/usehooks'
import { TMovieSearch, TSpotifySearch } from '@/types'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { addSpotifyAlbumAndCreator } from '@/lib/spotify'
const TCategories = ['movies', 'albums'] as const
import { toast } from 'sonner'

type PropTypes = {
  categories: typeof TCategories
}

type TState =
  | { type: 'movies'; data: TMovieSearch[] | null }
  | { type: 'albums'; data: TSpotifySearch | null }

const fetchingMovies = async (searchedTerm: string) => {
  const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(searchedTerm)}`)
  const data = await res.json()
  return data.results as TMovieSearch[]
}

const fetchAlbums = async (searchedTerm: string) => {
  const res = await fetch('/api/spotify/search?query=' + encodeURIComponent(searchedTerm))
  const data = (await res.json()) as TSpotifySearch
  return data
}

const ClientComp = ({ categories }: PropTypes) => {
  // const [selectedCategory, setSelectedCategory] = React.useState<TCategories[0]>(categories[0])
  const [formState, setFormState] = useState<TState | null>(null)
  const [currentInput, setCurrentInput] = React.useState<string>('')
  const [isSearching, setIsSearching] = React.useState(false)
  const debouncedSearched = useDebounce(currentInput, 300)

  React.useEffect(() => {
    const searchHN = async () => {
      setIsSearching(true)
      if (debouncedSearched) {
        switch (formState?.type) {
          case 'movies':
            const movieResults = await fetchingMovies(debouncedSearched)
            setFormState({
              type: 'movies',
              data: movieResults,
            })
            break
          case 'albums':
            const albumResults = await fetchAlbums(debouncedSearched)
            setFormState({
              type: 'albums',
              data: albumResults,
            })
            break
        }

        setIsSearching(false)
      }
    }

    searchHN()
  }, [debouncedSearched])

  return (
    <div className="space-y-3">
      <Select
        // defaultValue={}
        onValueChange={(val: (typeof TCategories)[number]) => {
          // setSelectedCategory(val)

          setFormState((prev) => {
            return {
              ...prev,
              type: val,
              data: null,
            }
          })
          setCurrentInput('')
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="w-full" position="item-aligned">
          <SelectGroup>
            {categories.map((category) => {
              return (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Input
        placeholder="Search..."
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
      />
      {(() => {
        switch (formState?.type) {
          case 'movies':
            return <MovieResults results={formState.data} />

          case 'albums':
            // if (resu)
            return <AlbumResults results={formState.data} />
        }
      })()}
    </div>
  )
}

const MovieResults = ({ results }: { results: TMovieSearch[] | null }) => {
  const addMovieToPayloadList = async (movie: TMovieSearch) => {
    const movieId = movie.id

    const res = await fetch('/api/tmdb/add', {
      method: 'POST',
      body: JSON.stringify({ id: movieId }),
    })

    const data = await res.json()
  }
  return (
    <div>
      <h1>Movie Search</h1>

      <div className="space-y-3">
        {results &&
          results.map((movie) => {
            return (
              <div key={movie.id} className="flex w-full justify-between border ">
                <Image
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  width={100}
                  height={150}
                />
                <div className="flex flex-col p-4 h-full ">
                  <h1>{movie.title}</h1>
                  <Button
                    onClick={async () => {
                      const res = await addMovieToPayloadList(movie)
                    }}
                  >
                    Add to Content
                  </Button>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

const AlbumResults = ({ results }: { results: TSpotifySearch | null }) => {
  return (
    <div>
      <h1>Album Search</h1>
      <div className="flex gap-3 flex-col">
        {results?.albums.items &&
          results.albums.items.map((album, i) => {
            return (
              <div key={i} className="flex w-full gap-2 border">
                <div>
                  <Image
                    src={album.images[0].url}
                    alt={`${album.id}-${i}`}
                    height={150}
                    width={150}
                  />
                </div>
                <div className="">
                  <h2>{album.name}</h2>
                  {album.artists.map((artist) => {
                    return <h3 key={artist.id}>{artist.name}</h3>
                  })}

                  <Button
                    onClick={async () => {
                      const albumData = await addSpotifyAlbumAndCreator(album.id)
                      if (!albumData.success) {
                        toast.warning('Already added.')
                      }

                      if (albumData.success) {
                        toast.success('Added!')
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export { ClientComp }
