import React from 'react'
import Link from '@/components/ui/link'
import { createPayload } from '@/utils/payload'
import { PAGINATION_LIMIT } from '@/lib/constants'
import { PaginaionList } from '@/components/pagination'

type HomePageProps = {
  searchParams?: Promise<{
    page?: string
  }>
  params: Promise<{ year: string }>
}

export default async function HomePage({ searchParams, params }: HomePageProps) {
  const { year } = await params
  const resolvedSearchParams = await searchParams
  const currentPage = Math.max(1, Number(resolvedSearchParams?.page) || 1)
  const payload = await createPayload()

  const list = await payload.find({
    collection: 'List',
    limit: PAGINATION_LIMIT,
    page: currentPage,
    where: {
      and: [
        {
          year: {
            equals: Number(year),
          },
        },
      ],
    },
  })

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Latest Lists Added for {year}</h1>

      <ul className="divide-y divide-border">
        {list.docs.length === 0 && <div>Nothing Found.</div>}
        {list.docs.map((doc) => {
          const category = typeof doc.category === 'object' ? doc.category?.id : null

          const creatorName =
            (typeof doc.author === 'object' && doc.author?.name) ||
            (typeof doc.publisher === 'object' && doc.publisher?.name)

          return (
            <li key={doc.id} className="py-6 first:pt-0">
              <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-primary mb-1">
                {category && <span>{category}</span>}
              </div>

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
      <PaginaionList list={list} currentPage={currentPage} route="/" />
    </div>
  )
}
