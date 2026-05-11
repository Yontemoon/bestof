import { List } from '@/payload-types'
import React from 'react'
import Link from './ui/link'

const ContentList = ({
  doc,
  showCategory = true,
  showYear = true,
}: {
  doc: List
  showCategory?: boolean
  showYear?: boolean
}) => {
  const category = typeof doc.category === 'object' ? doc.category?.id : doc.category
  const year = typeof doc.year === 'object' ? doc.year?.id : doc.year

  const creatorName =
    (typeof doc.author === 'object' && doc.author?.name) ||
    (typeof doc.publisher === 'object' && doc.publisher?.name)

  return (
    <li key={doc.id} className="py-3 first:pt-0">
      <div className="mb-0.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary">
        {showCategory && category && (
          <span>
            <Link href={`/category/${category}`}>{category}</Link>
          </span>
        )}
        {showCategory && showYear && category && year && <span className="opacity-30">|</span>}
        {showYear && year && (
          <span>
            <Link href={`/year/${year}`}> {year}</Link>
          </span>
        )}
      </div>

      <Link href={`/list/${doc.id}/${doc.slug}`}>
        <span className="text-lg font-semibold decoration-primary underline-offset-4 hover:underline">
          {doc.parent_title}
        </span>
      </Link>
      {creatorName && (
        <div className="text-muted-foreground text-sm tracking-wide">by {creatorName}</div>
      )}
    </li>
  )
}

export default ContentList
