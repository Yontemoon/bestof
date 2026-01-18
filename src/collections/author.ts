import { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { beforeChangeSlugify } from '@/lib/utils'
import type { Author as AuthorType } from '@/payload-types'

const beforeChangeHook: CollectionBeforeChangeHook<AuthorType> = ({ data }) => {
  if (!data) return data

  const newData = beforeChangeSlugify(data, 'name')
  return newData
}

export const Author: CollectionConfig = {
  slug: 'author',
  admin: {
    useAsTitle: 'name',
  },
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
    {
      name: 'related_lists',
      type: 'join',
      collection: 'List',
      on: 'author',
    },
  ],
}

// type AuthorType = typeof Author

// export type { AuthorType }
