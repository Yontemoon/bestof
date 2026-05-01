import React from 'react'
import { createPayload } from '@/utils/payload'

import { ClientComp } from './components'

const TCategories = ['movies', 'albums'] as const

const SearchPageTest = async () => {
  const payload = await createPayload()

  const data = await payload.find({
    collection: 'category',
    pagination: false,
  })

  const categories = data.docs.map((doc) => doc.id) as unknown as typeof TCategories

  return (
    <div className="w-full mt-5 space-y-3 break-all">
      <h1>Search Terms</h1>
      <div>
        <ClientComp categories={categories} />
      </div>
    </div>
  )
}

export default SearchPageTest
