import React from 'react'
import { createPayload } from '@/utils/payload'
import { PAGINATION_LIMIT } from '@/lib/constants'
import { PaginaionList } from '@/components/pagination'
import ContentList from '@/components/content-list'

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
          return <ContentList doc={doc} key={doc.id} showYear={false} />
        })}
      </ul>
      <PaginaionList list={list} currentPage={currentPage} route="/" />
    </div>
  )
}
