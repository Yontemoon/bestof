import React from 'react'
import { redirect } from 'next/navigation'
import { createPayload } from '@/utils/payload'
import Link from '@/components/ui/link'
import ImageList from '@/components/image-list'

const ContentPage = async ({ params }: { params: Promise<{ id: string; slug: string }> }) => {
  const { id: paramId, slug: paramSlug } = await params
  const payload = await createPayload()

  const contentDetails = await payload.findByID({
    collection: 'Content',
    id: paramId,
  })
  const { related_list, slug, id } = contentDetails

  if (!related_list || !related_list.docs) {
    return <div>Nothing here.</div>
  }

  if (slug !== paramSlug) {
    redirect(`/content/${id}/${slug}`)
  }

  const removedNum = related_list?.docs.filter((list) => typeof list !== 'number')

  const list = removedNum
    .flatMap((doc) => {
      return doc.parent_list?.map((list) => {
        const index = list.list_entry?.findIndex(
          (entry) =>
            typeof entry !== 'number' &&
            entry.content &&
            typeof entry.content !== 'number' &&
            entry.content.id &&
            entry.content.id === Number(id),
        )
        if (index === -1 || index === undefined) {
          return undefined
        }
        if (list.is_ordered) {
          return {
            rank: index + 1,
            title: doc.parent_title,
            link: doc.list_link,
            id: doc.id,
            slug: doc.slug,
          }
        } else {
          return {
            rank: null,
            title: doc.parent_title,
            link: doc.list_link,
            id: doc.id,
            slug: doc.slug,
          }
        }
      })
    })
    .filter((list) => list)

  list?.sort((curr, prev) => {
    if (!curr || !prev) {
      return -1
    }
    if (curr?.rank === null || prev?.rank === null) {
      return 1
    }
    return curr.rank - prev.rank
  })

  const creators = Array.isArray(contentDetails.creator)
    ? contentDetails.creator.filter(Boolean)
    : contentDetails.creator
      ? [contentDetails.creator]
      : []

  return (
    <div>
      {contentDetails.poster_url && (
        <div className="aspect-2/3 w-full overflow-hidden">
          <ImageList contentData={contentDetails} />
        </div>
      )}
      <div className="space-y-3">
        <h1 className="">{contentDetails.title}</h1>
        {creators.length > 0 && (
          <div className="flex flex-wrap items-center text-sm text-muted-foreground">
            <span>By</span>
            {creators.map((creator) => {
              if (typeof creator === 'number') {
                return null
              }
              return (
                <span key={creator.id} className="  px-1 py-1 leading-none">
                  {creator.creator}
                </span>
              )
            })}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {list.map((item, index) => {
          return (
            <div key={index}>
              <Link href={`/list/${item?.id}/${item?.slug}`}>
                {item?.rank && `${item.rank}. `} {item?.title}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContentPage
