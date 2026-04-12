import Link from '@/components/ui/link'
import React from 'react'
import { Separator } from './ui/separator'

const Footer = () => {
  return (
    <footer className="space-y-5 mt-20">
      <Separator className="border-secondary" />
      <div>
        <div className="flex flex-col gap-3 text-sm ">
          <span className="transition-opacity hover:opacity-70">
            {' '}
            <Link href={'/about'}>About </Link>
          </span>

          <span className="transition-opacity hover:opacity-70">
            {' '}
            <Link href={'/publishers'}>All Publishers </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
