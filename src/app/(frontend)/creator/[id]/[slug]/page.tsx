import { createPayload } from '@/utils/payload'
import React from 'react'
import { redirect } from 'next/navigation'

const CreatorPage = async ({ params }: { params: Promise<{ id: string; slug: string }> }) => {
  const { id, slug } = await params

  const payload = await createPayload()
  const data = await payload.findByID({
    collection: 'creator',
    id: id,
  })

  if (slug !== data.slug) {
    redirect(`/creator/${data.id}/${data.slug}`)
  }
  console.log(data)
  return <div>{JSON.stringify(data)}</div>
}

export default CreatorPage
