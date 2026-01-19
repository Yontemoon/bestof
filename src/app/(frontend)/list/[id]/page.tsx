import React from 'react'

import { createPayload } from '@/utils/payload'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const ListPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const payload = await createPayload()
  const data = await payload.findByID({
    collection: 'List',
    id: id,
  })

  redirect(`/list/${data.id}/${data.slug}`)
}

export default ListPage
