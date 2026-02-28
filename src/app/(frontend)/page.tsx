import React from 'react'

import Link from '@/components/ui/link'
import './styles.css'
import { createPayload } from '@/utils/payload'
import { JSX } from 'react'

export default async function HomePage() {
  const payload = await createPayload()

  const list = await payload.find({
    collection: 'List',
  })

  return (
    <div className="">
      <h2>Latest Lists Added</h2>
      <ul className="space-y-5">
        {list.docs.map((doc) => {
          return (
            <li key={doc.id} className="flex flex-col space-y-0.5">
              <Link href={`/list/${doc.id}/${doc.slug}`}>
                <span className="text-lg"> {doc.parent_title}</span>
              </Link>

              {typeof doc.author === 'object' && doc.author && 'id' in doc.author && (
                <span> {doc.author.name}</span>
              )}
              {/* <span>{formatData(doc.createdAt)}</span> */}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
