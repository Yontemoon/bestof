import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import {
  Author,
  Category,
  Content,
  Creator,
  List,
  Media,
  Publisher,
  Users,
  Year,
} from './collections'

import { Nav, YearNavbar } from './globals'

import dotenv from 'dotenv'
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Category, Content, Creator, List, Media, Publisher, Users, Author, Year],

  globals: [Nav, YearNavbar],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [],
})
