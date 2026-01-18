import React from 'react'
import Link from 'next/link'

import './styles.css'
import { createPayload } from '@/utils/payload'

export default async function HomePage() {
  const payload = await createPayload()

  const list = await payload.find({
    collection: 'List',
  })

  return (
    <div className="home">
      {list.docs.map((doc) => {
        return (
          <div key={doc.id}>
            {typeof doc.author === 'object' && doc.author && 'id' in doc.author && (
              <Link href={`/author/${doc.author.id}/${doc.author.slug}`}>{doc.author.name}</Link>
            )}
            <Link href={`/list/${doc.id}/${doc.slug}`}> {doc.parent_title}</Link>
          </div>
        )
      })}
    </div>
  )
}
