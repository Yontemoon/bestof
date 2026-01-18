import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/utils'

export const List: CollectionConfig = {
  slug: 'List',
  // admin:
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data.parent_title || !data.author) return data
        console.log(data)
        const payload = req.payload

        const authorDoc =
          typeof data.author === 'number'
            ? await payload.findByID({
                collection: 'author',
                id: data.author,
              })
            : data.author

        console.log(authorDoc)

        const authorSlug = slugify(authorDoc?.name)

        const parentSlug = slugify(data.parent_title)

        data.slug = `${authorSlug}-${parentSlug}`

        return data
      },
    ],
  },
  fields: [
    {
      name: 'parent_title',
      type: 'text',
      required: true,
    },
    {
      name: 'list_link',
      type: 'text',
      required: false,
    },
    {
      name: 'slug',
      type: 'text',
      required: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'publish_date',
      type: 'date',
      required: false,
    },
    {
      name: 'publisher',
      type: 'relationship',
      relationTo: 'publisher',
      required: false,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'author',
      required: false,
    },
    {
      name: 'year',
      type: 'relationship',
      relationTo: 'year',
      required: true,
    },

    {
      name: 'category',
      type: 'relationship',
      relationTo: 'category',
      required: true,
    },
    {
      name: 'parent_list',
      type: 'array',

      fields: [
        {
          name: 'list_title',
          type: 'text',
          required: false,
        },

        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
        {
          name: 'is_ordered',
          type: 'checkbox',
          defaultValue: false,
          required: true,
        },
        {
          name: 'list_entry',
          type: 'array',

          fields: [
            {
              name: 'content',
              type: 'relationship',
              relationTo: 'Content',
              required: true,
              filterOptions: ({ data }) => {
                if (!data.category) {
                  return true
                }

                return {
                  category: {
                    equals: data.category,
                  },
                }
              },
            },
          ],
        },
      ],
    },
  ],
}
