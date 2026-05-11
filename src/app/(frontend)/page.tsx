import React from 'react'
import Link from '@/components/ui/link'
import { createPayload } from '@/utils/payload'
import { PAGINATION_LIMIT } from '@/lib/constants'
import { PaginaionList } from '@/components/pagination'
import ContentList from '@/components/content-list'

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
    limit: PAGINATION_LIMIT,
    page: currentPage,
  })

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Latest Lists Added</h1>
      <ul className="divide-y divide-border">
        {list.docs.map((doc) => {
          return <ContentList doc={doc} key={doc.id} />
        })}
      </ul>
      <PaginaionList list={list} currentPage={currentPage} route="/" />
    </div>
  )
}
