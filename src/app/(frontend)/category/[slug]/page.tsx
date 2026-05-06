import { createPayload } from '@/utils/payload'
import Link from '@/components/ui/link'
import React from 'react'
import { PAGINATION_LIMIT } from '@/lib/constants'
import { PaginaionList } from '@/components/pagination'

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
    depth: 0,
    page: currentPage,
    limit: PAGINATION_LIMIT,
    where: {
      category: {
        equals: slug,
      },
    },
  })

  return (
    <div>
      {list.docs.map((doc) => {
        return (
          <div key={doc.id}>
            <Link href={`/list/${doc.id}/${doc.slug}`}>{doc.parent_title}</Link>
          </div>
        )
      })}
      <PaginaionList list={list} currentPage={currentPage} route={`/category/${slug}`} />
    </div>
  )
}

export default ContentPage
