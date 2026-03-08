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
    <div className="px-3 py-5 space-y-1 ">
      <h1>{data.parent_title}</h1>
      <div className="mb-4 flex flex-col space-y-2 text-sm">
        {typeof data.author === 'object' && data.author && 'id' in data.author && (
          <div className="">
            Written by:{' '}
            <Link href={`/author/${data.author.id}/${data.author.slug}`}>{data.author.name}</Link>
          </div>
        )}
        {data.list_link && (
          <div className="hover:underline">
            <a className="text-sm" href={data.list_link}>
              External Link
            </a>
          </div>
        )}

        {data.publish_date && (
          <div>Published in: {new Date(data.publish_date).toLocaleDateString()}</div>
        )}
      </div>

      <>
        {data.parent_list?.map((list) => {
          const isOrdered = list.is_ordered
          return (
            <div key={list.id} className="space-y-4 py-3">
              {list.list_title && <h1>{list.list_title}</h1>}
              {list.description && (
                <h3 className="text-sm text-foreground/50">{list.description}</h3>
              )}
              <ListComp className="space-y-4" isOrdered={isOrdered}>
                {list.list_entry?.map((list_entry, index) => {
                  if (list_entry.content && typeof list_entry.content === 'object') {
                    return (
                      <ContentComp
                        key={list_entry.id || index}
                        contentData={list_entry.content}
                        index={index}
                        is_ordered={list.is_ordered}
                      />
                    )
                  }
                  return null
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
    <li className="flex flex-col">
      <Link href={`/content/${contentData.id}/${contentData.slug}`}>
        <h3 className="text-xl font-extrabold">
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
