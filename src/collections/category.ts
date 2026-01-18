import type { CollectionConfig } from 'payload'

export const Category: CollectionConfig = {
  slug: 'category',
  admin: {
    useAsTitle: 'id',
  },

  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
    },

    {
      name: 'creator_type',
      type: 'text',
      required: true,
    },
    {
      name: 'associated_lists',
      type: 'join',
      collection: 'List',
      on: 'category',
    },
  ],
}
