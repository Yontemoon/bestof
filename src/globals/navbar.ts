import { GlobalConfig } from 'payload'

const Nav: GlobalConfig = {
  slug: 'top-navbar',
  fields: [
    {
      name: 'categories',
      type: 'array',
      required: true,

      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'category',
          required: true,
        },
      ],
    },
  ],
}

export default Nav
