import { CollectionConfig } from 'payload'

export const Author: CollectionConfig = {
  slug: 'author',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'related_lists',
      type: 'join',
      collection: 'List',
      on: 'author',
    },
  ],
}

type AuthorType = typeof Author

export type { AuthorType }
