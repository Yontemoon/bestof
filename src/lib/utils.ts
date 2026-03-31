import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

const formatDate = (dateStr: Date) => {
  return format(dateStr, 'PPP')
}

export { slugify, beforeChangeSlugify, cn, formatDate }
