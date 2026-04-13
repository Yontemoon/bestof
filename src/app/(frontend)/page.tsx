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
    <div className="space-y-3">
      <h1>Latest Lists Added</h1>
      <ul className="space-y-5">
        {list.docs.map((doc) => {
          return (
            <li key={doc.id} className="flex flex-col space-y-0.5">
              <span className="text-lg">
                {' '}
                <Link href={`/list/${doc.id}/${doc.slug}`}> {doc.parent_title} </Link>
              </span>

              {typeof doc.author === 'object' && doc.author && 'id' in doc.author && (
                <span className="text-muted-foreground"> {doc.author.name}</span>
              )}
              {!doc.author &&
                typeof doc.publisher === 'object' &&
                doc.publisher &&
                'id' in doc.publisher && (
                  <span className="text-muted-foreground">{doc.publisher.name}</span>
                )}
            </li>
          )
        })}
      </ul>
      <div className="mt-6 flex items-center gap-4 ">
        {list.hasPrevPage && <Link href={`/?page=${currentPage - 1}`}>Previous</Link>}
        <span>
          Page {list.page} of {list.totalPages}
        </span>
        {list.hasNextPage && <Link href={`/?page=${currentPage + 1}`}>Next</Link>}
      </div>
    </div>
  )
}
