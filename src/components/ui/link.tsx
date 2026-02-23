import React from 'react'
import NextLink from 'next/link'

type PropTypes = {
  href: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const Link = ({ href, children, size = 'md' }: PropTypes) => {
  return (
    <NextLink href={href}>
      <span className={`hover:underline text-${size}`}>{children}</span>
    </NextLink>
  )
}

export default Link
