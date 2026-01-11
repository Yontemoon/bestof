import React from 'react'

import { createPayload } from '@/utils/payload'

const ListPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const payload = await createPayload()
  const data = await payload.findByID({
    collection: 'List',
    id: id,
  })
  console.log(data)

  return <div>{JSON.stringify(data)}</div>
}

export default ListPage
