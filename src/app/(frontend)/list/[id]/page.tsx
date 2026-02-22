import { createPayload } from '@/utils/payload'
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
