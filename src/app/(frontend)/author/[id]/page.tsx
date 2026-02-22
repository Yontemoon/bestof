import { createPayload } from '@/utils/payload'
import { redirect } from 'next/navigation'
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
