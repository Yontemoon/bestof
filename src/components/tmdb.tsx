'use client'
import React, { useState } from 'react'
// import { useConfig } from '@payloadcms/ui' // Access Payload config/API
import { BeforeListTableServerProps } from 'payload'

const TMDBImportBar = (props: BeforeListTableServerProps) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const searchTMDB = async (val: string) => {
    setQuery(val)
    if (val.length < 3) return

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=YOUR_KEY&query=${val}`,
    )
    const data = await res.json()
    setResults(data.results || [])
  }

  const selectMovie = async (movie: any) => {
    // 1. Logic to check if it exists & create it via Payload's REST API or Local API
    const response = await fetch('/api/movies/import', {
      method: 'POST',
      body: JSON.stringify({
        title: movie.title,
        tmdbId: movie.id.toString(),
        overview: movie.overview,
      }),
    })

    if (response.ok) {
      window.location.reload() // Refresh the list to show the new movie
    }
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search TMDB to add movie..."
        value={query}
        onChange={(e) => searchTMDB(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((m) => (
            <li key={m.id} onClick={() => selectMovie(m)}>
              {m.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TMDBImportBar
