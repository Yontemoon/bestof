import type { CollectionConfig } from 'payload'

export const List: CollectionConfig = {
  slug: 'List',
  fields: [
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'category',
      required: true,
    },
  ],
}
