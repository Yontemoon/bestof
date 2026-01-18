import React from 'react'
import { createPayload } from '@/utils/payload'

const ContentPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const payload = await createPayload()
  const data = await payload.findByID({
    collection: 'Content',
    id: id,
  })

  return <div>{JSON.stringify(data)}</div>
}

export default ContentPage
