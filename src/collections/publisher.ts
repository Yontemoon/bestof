import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { beforeChangeSlugify } from '@/lib/utils'
import { Publisher as PublisherTypes } from '@/payload-types'

const beforeChangeHook: CollectionBeforeChangeHook<PublisherTypes> = ({ data }) => {
  if (!data) return data

  const newData = beforeChangeSlugify(data, 'name')
  return newData
}

export const Publisher: CollectionConfig = {
  slug: 'publisher',
  hooks: {
    beforeChange: [beforeChangeHook],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        hidden: true,
      },
    },
  ],
}
