import React from 'react'
import { redirect } from 'next/navigation'
import { createPayload } from '@/utils/payload'
import Link from '@/components/ui/link'

const ContentPage = async ({ params }: { params: Promise<{ id: string; slug: string }> }) => {
  const { id: paramId, slug: paramSlug } = await params
  const payload = await createPayload()

  const contentDetails = await payload.findByID({
    collection: 'Content',
    id: paramId,
  })
  const { related_list, slug, id } = contentDetails

  console.log(contentDetails)

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
        if (
          !list.list_entry ||
          typeof list.list_entry[0].content === 'number' ||
          typeof list.list_entry[0].content !== 'object'
        ) {
          return undefined
        }
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
      return -1
    }
    return curr.rank - prev.rank
  })
  console.log(list)

  return (
    <div>
      <h1 className="mb-5">{contentDetails.title}</h1>
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
  )
}

export default ContentPage
