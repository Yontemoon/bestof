import React from 'react'
import Link from '@/components/ui/link'
import { createPayload } from '@/utils/payload'

type HomePageProps = {
  searchParams?: Promise<{
    page?: string
  }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams
  const currentPage = Math.max(1, Number(resolvedSearchParams?.page) || 1)
  const payload = await createPayload()

  const list = await payload.find({
    collection: 'List',
    limit: 20,
    page: currentPage,
  })

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Latest Lists Added</h1>

      <ul className="divide-y divide-border">
        {list.docs.map((doc) => {
          const category = typeof doc.category === 'object' ? doc.category?.id : null
          const year = typeof doc.year === 'object' ? doc.year?.id : doc.year

          const creatorName =
            (typeof doc.author === 'object' && doc.author?.name) ||
            (typeof doc.publisher === 'object' && doc.publisher?.name)

          return (
            <li key={doc.id} className="py-6 first:pt-0">
              {/* Top Emphasis Row: Category & Year */}
              <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-primary mb-1">
                {category && <span>{category}</span>}
                {category && year && <span className="opacity-30">|</span>}
                {year && <span>{year}</span>}
              </div>

              {/* Main Title and Creator */}

              <Link href={`/list/${doc.id}/${doc.slug}`}>
                <span className=' className="text-xl font-semibold hover:underline decoration-primary underline-offset-4"'>
                  {' '}
                  {doc.parent_title}
                </span>
              </Link>
              <div>
                {creatorName && (
                  <span className="text-muted-foreground  text-sm tracking-wider">
                    by {creatorName}
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {/* Pagination */}
      <div className="mt-10 pt-6 border-t flex items-center justify-between">
        <div className="flex gap-4">
          {list.hasPrevPage && (
            <Link href={`/?page=${currentPage - 1}`}>
              <span className="hover:text-primary">← Previous</span>
            </Link>
          )}
          {list.hasNextPage && (
            <Link href={`/?page=${currentPage + 1}`}>
              <span className="hover:text-primary">Next →</span>
            </Link>
          )}
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          Page {list.page} of {list.totalPages}
        </span>
      </div>
    </div>
  )
}
