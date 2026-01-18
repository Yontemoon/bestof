import React from 'react'

import { createPayload } from '@/utils/payload'
import Link from 'next/link'

const ListPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const payload = await createPayload()
  const data = await payload.findByID({
    collection: 'List',
    id: id,
  })
  console.log(data)

  return (
    <div>
      <h1>{data.parent_title}</h1>
      <h2>
        {typeof data.author === 'object' && data.author && 'id' in data.author && (
          <Link href={`/author/${data.author.id}`}>{data.author.name}</Link>
        )}
      </h2>
      <div>
        {data.parent_list?.map((list) => {
          return (
            <div key={list.id}>
              {list.list_entry?.map((list_entry, index) => {
                return (
                  <div key={index}>
                    <Link href={`/content/${list_entry.content.id}`}>
                      <h3>{list_entry.content.title}</h3>
                    </Link>
                    <Link href={`/creator/${list_entry.content.creator.id}`}>
                      <h3>{list_entry.content.creator.creator}</h3>
                    </Link>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ListPage
