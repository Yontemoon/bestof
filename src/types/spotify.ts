type TSpotifySearch = {
  albums: {
    href: string
    limit: number
    next: string
    offset: number
    previous: null
    total: number
    items: TAlbum[]
  }
}

type TAlbum = {
  album_type: string
  total_tracks: number
  available_markets: string[]
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: {
    height: number
    url: string
    width: number
  }[]
  name: string
  release_date: string
  release_date_precision: string
  type: string
  uri: string
  artists: {
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    name: string
    type: string
    uri: string
  }[]
}

export type { TSpotifySearch, TAlbum }
