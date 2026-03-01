import React from 'react'
import { createPayload } from '@/utils/payload'
import Link from '@/components/ui/link'
import { redirect } from 'next/navigation'
import type { Content } from '@/payload-types'
import { cn } from '@/lib/utils'

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
  console.log(data)

  return (
    <div className="px-3 py-5 space-y-1">
      <h1>{data.parent_title}</h1>
      <span className="mb-4">
        {typeof data.author === 'object' && data.author && 'id' in data.author && (
          <span className="text-sm">
            Written by:{' '}
            <Link href={`/author/${data.author.id}/${data.author.slug}`}>{data.author.name}</Link>
          </span>
        )}
      </span>
      <div className="text-sm">
        {data.publish_date && <span>{new Date(data.publish_date).toLocaleDateString()}</span>}
      </div>
      <>
        {data.parent_list?.map((list) => {
          const isOrdered = list.is_ordered
          return (
            <div key={list.id} className="space-y-4 py-3 px-5">
              {list.list_title && <h1>{list.list_title}</h1>}
              {list.description && <h3>{list.description}</h3>}
              <ListComp className="space-y-4" isOrdered={isOrdered}>
                {list.list_entry?.map((list_entry, index) => {
                  return (
                    <>
                      {typeof list_entry.content === 'object' && list_entry.content && (
                        <ContentComp
                          key={list_entry.id || index}
                          contentData={list_entry.content}
                          index={index}
                          is_ordered={list.is_ordered}
                        />
                      )}
                    </>
                  )
                })}
              </ListComp>
            </div>
          )
        })}
      </>
    </div>
  )
}

const ListComp = ({
  isOrdered,
  children,
  className,
}: {
  isOrdered: boolean
  children: React.ReactNode
  className: string
}) => {
  if (isOrdered) {
    return <ol className={cn(className)}>{children}</ol>
  } else {
    return <ul className={cn(className)}>{children}</ul>
  }
}

const ContentComp = ({
  contentData,
  index,
  is_ordered,
}: {
  contentData: Content
  index: number
  is_ordered: boolean
}) => {
  return (
    <li className="flex flex-col px-3">
      <Link href={`/content/${contentData.id}/${contentData.slug}`}>
        <h3 className="text-2xl font-extrabold">
          {is_ordered && <span>{index + 1}. </span>}

          {contentData.title}
        </h3>
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
    </li>
  )
}

export default ListPage
