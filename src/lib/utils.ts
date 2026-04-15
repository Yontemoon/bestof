import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { List } from '@/payload-types'
import { PaginatedDocs } from 'payload'

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

const sortPayloadList = (paginatedList: PaginatedDocs<List>, id: number) => {
  const removedNum = paginatedList.docs.filter((list) => typeof list !== 'number')
  const list = removedNum
    .flatMap((doc) => {
      return doc.parent_list?.map((list) => {
        const index = list.list_entry?.findIndex(
          (entry) =>
            typeof entry !== 'number' &&
            entry.content &&
            typeof entry.content !== 'number' &&
            entry.content.id &&
            entry.content.id === id,
        )
        if (index === -1 || index === undefined) {
          return undefined
        }
        if (list.is_ordered) {
          return {
            rank: index + 1,
            title: doc.parent_title,
            link: doc.list_link,
            id: doc.id,
            slug: doc.slug,
          }
        } else {
          return {
            rank: null,
            title: doc.parent_title,
            link: doc.list_link,
            id: doc.id,
            slug: doc.slug,
          }
        }
      })
    })
    .filter((list) => list)

  const sortedList = list
    ? [...list].sort((a, b) => {
        // 1. Handle cases where the objects or ranks might be missing
        const rankA = a?.rank
        const rankB = b?.rank

        // 2. If both are missing/null, they are equal
        if (rankA === rankB) return 0

        // 3. Move null/undefined to the end
        if (rankA === null || rankA === undefined) return 1
        if (rankB === null || rankB === undefined) return -1

        // 4. Actual Numeric Sort (Descending: high to low)
        return rankA - rankB
      })
    : []
  return sortedList
}

export { slugify, beforeChangeSlugify, cn, formatDate, sortPayloadList }
