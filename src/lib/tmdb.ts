import { IMDB_URL } from './constants'

/**
 *  Never call this on the client due to the bearer token being exposed. This is only for server side calls.
 * @param url string
 */
const tmdbFetchWrapper = async <T extends unknown>(url: string) => {
  const res = await fetch(`${IMDB_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${process.env.MOVIE_DB_API}`,
      accept: 'application/json',
    },
  })
  const data = await res.json()

  return data as T
}

export { tmdbFetchWrapper }
