import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { Content as ContentType } from '@/payload-types'
import { beforeChangeSlugify } from '@/lib/utils'

const beforeChangeHook: CollectionBeforeChangeHook<ContentType> = ({ data }) => {
  if (!data) return data

  const newData = beforeChangeSlugify(data, 'title')
  return newData
}

export const Content: CollectionConfig = {
  slug: 'Content',
  hooks: {
    beforeChange: [beforeChangeHook],
  },
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
      defaultValue: 'movies',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      defaultValue: () => {
        return 'seomthing'
      },
      admin: {
        hidden: true,
      },
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
    {
      name: 'related_list',
      type: 'join',
      collection: 'List',
      on: 'parent_list.list_entry.content',
    },
  ],
}
