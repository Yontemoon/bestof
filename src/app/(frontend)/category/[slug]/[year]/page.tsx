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
    allResult.docs.reduce<Record<number, { movie: Content; count: number }>>((acc, doc) => {
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
            movie: entry.content,
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
      <div className="mt-4 space-y-3">
        {list.docs.map((doc) => {
          return (
            <div key={doc.id}>
              <Link
                href={`/list/${doc.id}/${doc.slug}`}
                className="text-base font-semibold tracking-tight underline-offset-4 hover:text-primary hover:underline"
              >
                {doc.parent_title}
              </Link>
              {typeof doc.author === 'object' && doc.author && 'id' in doc.author && (
                <div className="mt-1 text-sm text-muted-foreground">
                  by{' '}
                  <Link
                    href={`/author/${doc.author.id}/${doc.author.slug}`}
                    className="underline-offset-4 hover:text-primary hover:underline"
                  >
                    {doc.author.name}
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <PaginaionList list={list} currentPage={currentPage} route={`/category/${slug}/${year}`} />
    </div>
  )
}

export default CategoryBaseOnYear
