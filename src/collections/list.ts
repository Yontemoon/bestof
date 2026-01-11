import type { CollectionConfig } from 'payload'

export const List: CollectionConfig = {
  slug: 'List',
  fields: [
    {
      name: 'parent_title',
      type: 'text',
      required: true,
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
      name: 'year_list',
      type: 'text',
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
