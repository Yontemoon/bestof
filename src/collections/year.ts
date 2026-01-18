import { CollectionConfig } from 'payload'

export const Year: CollectionConfig = {
  slug: 'year',
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'id',
      type: 'number',
      required: true,
    },
  ],
}
