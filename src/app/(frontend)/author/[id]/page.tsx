import { createPayload } from '@/utils/payload'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const AuthorPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const payload = await createPayload()
  const data = await payload.findByID({
    collection: 'author',
    id: id,
  })

  redirect(`/author/${data.id}/${data.slug}`)
}

export default AuthorPage
