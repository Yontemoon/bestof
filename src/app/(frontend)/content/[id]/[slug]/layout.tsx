import { createPayload } from '@/utils/payload'

export async function generateStaticParams() {
  const payload = await createPayload()
  const { docs } = await payload.find({
    collection: 'Content',
    pagination: false,
  })

  return docs.map((doc) => ({
    id: String(doc.id),
    slug: doc.slug,
  }))
}

const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default layout
