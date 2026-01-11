import { createPayload } from '@/utils/payload'
import React from 'react'

const CreatorPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  console.log(id)
  const payload = await createPayload()
  const data = await payload.findVersionByID({
    collection: 'author',
    id: id,
  })
  console.log(data)
  return <div>{JSON.stringify(data)}</div>
}

export default CreatorPage
