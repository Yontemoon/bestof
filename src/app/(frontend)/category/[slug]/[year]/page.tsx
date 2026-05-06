import React from 'react'
import { createPayload } from '@/utils/payload'
import Link from 'next/link'
import { PAGINATION_LIMIT } from '@/lib/constants'
import { PaginaionList } from '@/components/pagination'
import type { Content } from '@/payload-types'
import { ChartBarHorizontal } from '@/components/horizontal-chart'

const CategoryBaseOnYear = async ({
  params,
  searchParams,
}: {
  params: Promise<{ year: string; slug: string }>
  searchParams?: Promise<{
    page?: string
  }>
}) => {
  const { slug, year } = await params
  const payload = await createPayload()

  const allResult = await payload.find({
    collection: 'List',

    pagination: false,
    where: {
      and: [
        {
          category: {
            equals: slug,
          },
        },
        {
          year: {
            equals: Number(year),
          },
        },
      ],
    },
  })

  const all = Object.values(
    allResult.docs.reduce<Record<number, { movie: string; count: number }>>((acc, doc) => {
      for (const parentList of doc.parent_list ?? []) {
        for (const entry of parentList.list_entry ?? []) {
          if (typeof entry.content === 'number') continue

          const movieId = entry.content.id
          const existing = acc[movieId]

          if (existing) {
            existing.count += 1
            continue
          }

          acc[movieId] = {
            movie: entry.content.title,
            count: 1,
          }
        }
      }

      return acc
    }, {}),
  )
    .sort((curr, prev) => prev.count - curr.count)
    .slice(0, 10)
  console.log(all)

  const resolvedSearchParams = await searchParams
  const currentPage = Math.max(1, Number(resolvedSearchParams?.page) || 1)

  const list = await payload.find({
    collection: 'List',
    page: currentPage,
    limit: PAGINATION_LIMIT,
    where: {
      and: [
        {
          category: {
            equals: slug,
          },
        },
        {
          year: {
            equals: Number(year),
          },
        },
      ],
    },
  })

  return (
    <div className="space">
      <ChartBarHorizontal chartData={all} />
      <div className="mt-4">
        {list.docs.map((doc) => {
          return (
            <div key={doc.id}>
              <Link href={`/list/${doc.id}/${doc.slug}`}>{doc.parent_title}</Link>
            </div>
          )
        })}
      </div>
      <PaginaionList list={list} currentPage={currentPage} route={`/category/${slug}/${year}`} />
    </div>
  )
}

export default CategoryBaseOnYear
