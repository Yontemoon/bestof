import { createPayload } from '@/utils/payload'
import { redirect } from 'next/navigation'
import React from 'react'

const CreatorPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const payload = await createPayload()
  const data = await payload.findByID({
    collection: 'creator',
    id: id,
  })

  redirect(`/creator/${data.id}/${data.slug}`)
}

export default CreatorPage
