import Link from '@/components/ui/link'
import React from 'react'

const Footer = () => {
  return (
    <footer>
      <div className="container mx-auto py-4 text-center">
        <div>Best of</div>
        <div className="flex flex-col">
          <Link href={'/about'}>
            <span>About</span>
          </Link>
          <Link href={'/publishers'}>
            <span>All Publishers</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
