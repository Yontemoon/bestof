import type { CollectionConfig } from 'payload'

export const ListEntry: CollectionConfig = {
  slug: 'ListEntry',
  fields: [
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'category',
      required: true,
    },
  ],
}
