import React from 'react'

import { createPayload } from '@/utils/payload'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const ListPage = async ({ params }: { params: Promise<{ id: string; slug: string }> }) => {
  const { id, slug } = await params

  const payload = await createPayload()
  const data = await payload.findByID({
    collection: 'List',
    id: id,
  })

  if (data.slug !== slug) {
    redirect(`/list/${data.id}/${data.slug}`)
  }

  // const contentList = data.parent_list.

  return (
    <div>
      <h1>{data.parent_title}</h1>
      <h2>
        {typeof data.author === 'object' && data.author && 'id' in data.author && (
          <Link href={`/author/${data.author.id}/${data.author.slug}`}>{data.author.name}</Link>
        )}
      </h2>
      <div>
        {data.parent_list?.map((list) => {
          return (
            <div key={list.id}>
              {list.list_entry?.map((list_entry, index) => {
                return (
                  <div key={list_entry.id || index}>
                    {typeof list_entry.content === 'object' && list_entry.content && (
                      <>
                        <Link href={`/content/${list_entry.content.id}/${list_entry.content.slug}`}>
                          <h3>{list_entry.content.title}</h3>
                        </Link>
                        {Array.isArray(list_entry.content.creator) &&
                          list_entry.content.creator.map((creator) => {
                            if (typeof creator === 'object' && creator !== null) {
                              return (
                                <Link key={creator.id} href={`/creator/${creator.id}/${creator.slug}`}>
                                  <h3>{creator.creator}</h3>
                                </Link>
                              )
                            }
                            return null
                          })}
                      </>
                    )}
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
