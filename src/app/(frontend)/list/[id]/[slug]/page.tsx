import React from 'react'
import { createPayload } from '@/utils/payload'
import Link from '@/components/ui/link'
import { redirect } from 'next/navigation'
import type { Content } from '@/payload-types'
import { cn, formatDate } from '@/lib/utils'
import ImageList from '@/components/image-list'

export async function generateStaticParams() {
  const payload = await createPayload()
  const { docs } = await payload.find({
    collection: 'List',
    pagination: false,
  })

  return docs
    .filter((doc) => doc.slug)
    .map((doc) => ({
      id: String(doc.id),
      slug: doc.slug,
    }))
}

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

  const publisherName =
    data.publisher && typeof data.publisher !== 'number' ? data.publisher?.name : null

  const category = typeof data.category === 'object' ? data.category?.id : null
  const year = typeof data.year === 'object' ? data.year?.id : data.year

  return (
    <div className="mx-auto w-full">
      <div className="space-y-4">
        <header className="border-b border-border space-y-4">
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-primary ">
            {category && <span>{category}</span>}
            {category && year && <span className="opacity-30">|</span>}
            {year && <span>{year}</span>}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{data.parent_title}</h1>
          <div className="text-sm leading-6 text-muted-foreground mb-2">
            {typeof data.author === 'object' && data.author && 'id' in data.author && (
              <div className="flex flex-wrap items-center">
                {data.publish_date && (
                  <span>{formatDate(new Date(data.publish_date))}&nbsp;/&nbsp;</span>
                )}
                <span className="pr-1">
                  <Link href={`/author/${data.author.id}/${data.author.slug}`}>
                    {data.author.name},
                  </Link>
                </span>
                {data.list_link && publisherName && (
                  <span>
                    <>as published from</>
                    <a className="pl-1 hover:underline" href={data.list_link}>
                      {publisherName}
                    </a>
                  </span>
                )}
              </div>
            )}
            {!data.author &&
              data.publisher &&
              data.publisher &&
              typeof data.publisher !== 'number' && (
                <div>
                  {data.publish_date && (
                    <span>{formatDate(new Date(data.publish_date))}&nbsp;/&nbsp;</span>
                  )}
                  {data.list_link && publisherName && (
                    <span>
                      <>as published from</>
                      <a className="pl-1 hover:underline" href={data.list_link}>
                        {publisherName}
                      </a>
                    </span>
                  )}
                </div>
              )}
          </div>
        </header>

        {data.parent_list?.map((list) => {
          const isOrdered = list.is_ordered
          return (
            <section key={list.id} className="space-y-4">
              {list.list_title && (
                <h2 className="text-2xl font-semibold tracking-tight">{list.list_title}</h2>
              )}
              {list.description && (
                <h3 className="text-sm leading-6 text-muted-foreground">{list.description}</h3>
              )}
              <ListComp
                className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
                isOrdered={isOrdered}
              >
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
            </section>
          )
        })}
      </div>
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
    <li className="flex h-full flex-col gap-3">
      {contentData ? (
        <Link href={`/content/${contentData.id}/${contentData.slug}`}>
          <div className="mx-auto max-w-48 overflow-hidden h-full">
            <ImageList contentData={contentData} />
          </div>
        </Link>
      ) : null}
      <div className="min-w-0 space-y-2 px-1">
        <h3 className="wrap-break-word text-base font-semibold leading-6 sm:text-lg">
          <Link href={`/content/${contentData.id}/${contentData.slug}`}>
            {is_ordered && <span className="mr-1 text-muted-foreground">{index + 1}.</span>}
            {contentData.title}
          </Link>
        </h3>

        <div className="space-y-1 text-sm leading-5 text-muted-foreground ">
          {Array.isArray(contentData.creator) &&
            contentData.creator.map((creator) => {
              if (typeof creator === 'object' && creator !== null) {
                return (
                  <div key={creator.id} className="wrap-break-word">
                    <Link href={`/creator/${creator.id}/${creator.slug}`}>{creator.creator}</Link>
                  </div>
                )
              }
              return null
            })}
        </div>
      </div>
    </li>
  )
}

export default ListPage
