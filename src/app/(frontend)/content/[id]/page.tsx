import { createPayload } from '@/utils/payload'
import { redirect } from 'next/navigation'

const ContentPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const payload = await createPayload()
  const data = await payload.findByID({
    collection: 'Content',
    id: id,
  })

  redirect(`/content/${data.id}/${data.slug}`)
}

export default ContentPage
