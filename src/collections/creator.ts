import type { CollectionConfig } from 'payload'

export const Creator: CollectionConfig = {
  slug: 'creator',
  admin: {
    useAsTitle: 'creator',
  },
  fields: [
    {
      name: 'creator',
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
