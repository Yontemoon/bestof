import Link from '@/components/ui/link'
import React from 'react'

const Footer = () => {
  return (
    <footer>
      <div className="container mx-auto py-4 text-center">
        <div>Best of</div>
        <div>
          <Link href={'/about'}>
            <span>About</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
