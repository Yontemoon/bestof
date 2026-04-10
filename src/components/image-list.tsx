import { Content } from '@/payload-types'
import React from 'react'
import Image from 'next/image'

type PropTypes = {
  contentData: Content
}

const ImageList = ({ contentData }: PropTypes) => {
  return (
    <div className="relative h-full w-full">
      {contentData.title && contentData.poster_url && (
        <Image
          alt={`${contentData.title} poster`}
          fill
          sizes="100%"
          className="rounded-md object-cover"
          loading="lazy"
          src={contentData.poster_url}
        />
      )}
    </div>
  )
}

export default ImageList
