import React from 'react'
import Link from 'next/link'

import './styles.css'
import { createPayload } from '@/utils/payload'
import type { Author } from '@/payload-types'

export default async function HomePage() {
  const payload = await createPayload()

  const list = await payload.find({
    collection: 'List',
  })
  console.log(list)

  return (
    <div className="home">
      {list.docs.map((doc) => {
        return (
          <div key={doc.id}>
            {typeof doc.author === 'object' && doc.author && 'id' in doc.author && (
              <Link href={`/author/${doc.author.id}`}>{doc.author.name}</Link>
            )}
            <Link href={`/list/${doc.id}`}> {doc.parent_title}</Link>
          </div>
        )
      })}
    </div>
  )
}
