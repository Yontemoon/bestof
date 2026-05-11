import { createPayload } from '@/utils/payload'
import Link from '@/components/ui/link'
import React from 'react'
import { PAGINATION_LIMIT } from '@/lib/constants'
import { PaginaionList } from '@/components/pagination'
import ContentList from '@/components/content-list'

const ContentPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{
    page?: string
  }>
}) => {
  const { slug } = await params

  const payload = await createPayload()
  const resolvedSearchParams = await searchParams
  const currentPage = Math.max(1, Number(resolvedSearchParams?.page) || 1)

  const list = await payload.find({
    collection: 'List',
    depth: 1,
    page: currentPage,
    limit: PAGINATION_LIMIT,
    where: {
      category: {
        equals: slug,
      },
    },
  })

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Latest {slug} Added</h1>
      <ul className="divide-y divide-border">
        {list.docs.map((doc) => {
          return <ContentList doc={doc} key={doc.id} showCategory={false} />
        })}
      </ul>
      <PaginaionList list={list} currentPage={currentPage} route={`/category/${slug}`} />
    </>
  )
}

export default ContentPage
