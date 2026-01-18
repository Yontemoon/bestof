import React from 'react'
import { createPayload } from '@/utils/payload'
import Link from 'next/link'

const ContentPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const payload = await createPayload()
  const { related_list } = await payload.findByID({
    collection: 'Content',
    id: id,
  })

  if (!related_list || !related_list.docs) {
    return <div>Nothing here.</div>
  }

  const removedNum = related_list?.docs.filter((list) => typeof list !== 'number')

  const list = removedNum.flatMap((doc) => {
    return doc.parent_list?.map((list) => {
      if (list.is_ordered) {
        const index = list.list_entry?.findIndex((entry) => entry.content === Number(id))

        if (!index) {
          return {
            rank: null,
            title: doc.parent_title,
            link: doc.list_link,
            id: doc.id,
          }
        }
        return {
          rank: index + 1,
          title: doc.parent_title,
          link: doc.list_link,
          id: doc.id,
        }
      } else {
        return {
          rank: null,
          title: doc.parent_title,
          link: doc.list_link,
          id: doc.id,
        }
      }
    })
  })

  list?.sort((curr, prev) => {
    if (!curr || !prev) {
      return -1
    }
    if (curr?.rank === null || prev?.rank === null) {
      return -1
    }
    return prev.rank - curr.rank
  })

  return (
    <div>
      {list.map((item, index) => {
        return (
          <div key={index}>
            <Link href={`/list/${item?.id}`}>{item?.title}</Link>
          </div>
        )
      })}
    </div>
  )
}

export default ContentPage
