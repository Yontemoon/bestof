import type { CollectionConfig } from 'payload'

export const Publisher: CollectionConfig = {
  slug: 'publisher',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
