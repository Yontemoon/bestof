import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/utils'

export const Creator: CollectionConfig = {
  slug: 'creator',
  admin: {
    useAsTitle: 'creator',
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.creator) return data

        const creatorSlugify = slugify(data.creator)

        data.slug = creatorSlugify

        return data
      },
    ],
  },
  fields: [
    {
      name: 'creator',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        hidden: true,
      },
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'category',
      required: true,
    },
    {
      name: 'unique_id',
      admin: {
        hidden: true,
      },
      type: 'text',
      // required: true,
      unique: true,
    },
    {
      name: 'related_list',
      type: 'join',
      collection: 'List',
      on: 'parent_list.list_entry.content',
    },
  ],
}
