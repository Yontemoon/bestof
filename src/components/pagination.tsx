import { List } from '@/payload-types'
import Link from 'next/link'
import { PaginatedDocs } from 'payload'
import React from 'react'

type PropTypes = {
  list: PaginatedDocs<List>
  currentPage: number
  route: string
}

const PaginaionList = ({ list, currentPage, route }: PropTypes) => {
  return (
    <div className="mt-10 pt-6 border-t flex items-center justify-between">
      <div className="flex gap-4">
        {list.hasPrevPage && (
          <Link href={`${route}?page=${currentPage - 1}`}>
            <span className="hover:text-primary">← Previous</span>
          </Link>
        )}
        {list.hasNextPage && (
          <Link href={`${route}?page=${currentPage + 1}`}>
            <span className="hover:text-primary">Next →</span>
          </Link>
        )}
      </div>
      <span className="text-sm text-muted-foreground font-medium">
        Page {list.page} of {list.totalPages}
      </span>
    </div>
  )
}

export { PaginaionList }
