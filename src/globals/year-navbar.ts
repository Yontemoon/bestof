import { GlobalConfig } from 'payload'

const YearNavbar: GlobalConfig = {
  slug: 'year-navbar',
  fields: [
    {
      name: 'years',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'year',
          required: true,
          type: 'relationship',
          relationTo: 'year',
        },
      ],
    },
  ],
}

export default YearNavbar
