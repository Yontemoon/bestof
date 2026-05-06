import React from 'react'
import NextLink from 'next/link'
import { cn } from '@/lib/utils'

type PropTypes = {
  href: string
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const Link = ({ href, children, size = 'md', className }: PropTypes) => {
  return (
    <NextLink href={href}>
      <span className={cn(className, `hover:underline text-${size}`)}>{children}</span>
    </NextLink>
  )
}

export default Link
