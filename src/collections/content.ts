import type { CollectionConfig } from 'payload'

export const Content: CollectionConfig = {
  slug: 'Content',

  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
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
      name: 'creator',
      type: 'relationship',
      relationTo: 'creator',
      required: true,

      filterOptions: ({ data }) => {
        console.log(data)
        // If no category is selected yet, don't filter (or return false to hide all)
        if (!data.category) {
          return true
        }

        // data.category will be the ID of the selected category
        // We tell Payload: "Only show creators where their category field matches this ID"
        return {
          category: {
            equals: data.category,
          },
        }
      },
    },
  ],
}
