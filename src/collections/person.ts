import type { CollectionConfig } from 'payload'

export const Person: CollectionConfig = {
  slug: 'person',
  fields: [
    {
      name: 'person',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'category',
      required: true,
    },
  ],
}
