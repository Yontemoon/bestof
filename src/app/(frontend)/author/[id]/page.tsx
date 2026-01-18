import { createPayload } from '@/utils/payload'
import Link from 'next/link'
import React from 'react'

const AuthorPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const payload = await createPayload()
  const data = await payload.findByID({
    collection: 'author',
    id: id,
  })
  console.log(data)
  return (
    <div>
      {<h1>{data.name}</h1>}
      <div>
        {data.related_lists?.docs?.map((list) => {
          if (typeof list === 'number') {
            return <div>{list}</div>
          } else {
            return (
              <div key={list.id}>
                <Link href={`/list/${list.id}`}>{list.parent_title}</Link>
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}

export default AuthorPage
