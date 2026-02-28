import React from 'react'
import { createPayload } from '@/utils/payload'
import Link from '@/components/ui/link'
import { redirect } from 'next/navigation'
import type { Content } from '@/payload-types'

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

  return (
    <div className="px-3 py-5">
      <h1>{data.parent_title}</h1>
      <h2>
        {typeof data.author === 'object' && data.author && 'id' in data.author && (
          <Link href={`/author/${data.author.id}/${data.author.slug}`}>{data.author.name}</Link>
        )}
      </h2>
      <>
        {data.parent_list?.map((list) => {
          return (
            <div key={list.id} className="space-y-4 py-7 px-5">
              {list.list_title && <h1>{list.list_title}</h1>}
              {list.description && <h3>{list.description}</h3>}
              <div className="space-y-4">
                {list.list_entry?.map((list_entry, index) => {
                  return (
                    <div key={list_entry.id || index} className="px-3">
                      {typeof list_entry.content === 'object' && list_entry.content && (
                        <ContentComp contentData={list_entry.content} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </>
    </div>
  )
}

const ContentComp = ({ contentData }: { contentData: Content }) => {
  return (
    <div className="flex flex-col">
      <Link href={`/content/${contentData.id}/${contentData.slug}`}>
        <h3 className="text-2xl font-extrabold">{contentData.title}</h3>
      </Link>
      {Array.isArray(contentData.creator) &&
        contentData.creator.map((creator) => {
          if (typeof creator === 'object' && creator !== null) {
            return (
              <Link key={creator.id} href={`/creator/${creator.id}/${creator.slug}`}>
                <h4>{creator.creator}</h4>
              </Link>
            )
          }
          return null
        })}
    </div>
  )
}

export default ListPage
