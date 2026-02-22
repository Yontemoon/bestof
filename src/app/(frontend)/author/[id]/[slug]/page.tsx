import { createPayload } from '@/utils/payload'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const AuthorPage = async ({ params }: { params: Promise<{ id: string; slug: string }> }) => {
  const { id, slug } = await params

  const payload = await createPayload()
  const data = await payload.findByID({
    collection: 'author',
    id: id,
  })

  if (slug !== data.slug) {
    redirect(`/author/${data.id}/${data.slug}`)
  }

  return (
    <div>
      {<h1>{data.name}</h1>}
      <div>
        {data.related_lists?.docs?.map((list) => {
          if (typeof list === 'number') {
            return <div key={list}>{list}</div>
          } else {
            return (
              <div key={list.id}>
                <Link href={`/list/${list.id}/${list.slug}`}>{list.parent_title}</Link>
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}

export default AuthorPage
