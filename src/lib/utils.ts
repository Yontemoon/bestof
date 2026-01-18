const slugify = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

type SlugSource = {
  [key: string]: unknown
  slug?: string | null
}
const beforeChangeSlugify = <K extends keyof SlugSource>(data: SlugSource, key: K) => {
  const value = data[key]

  if (typeof value !== 'string') return data

  data.slug = slugify(value)
  return data
}

export { slugify, beforeChangeSlugify }
