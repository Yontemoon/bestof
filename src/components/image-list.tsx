import { Content } from '@/payload-types'
import React from 'react'
import Image from 'next/image'

type PropTypes = {
  contentData: Content
}

const ImageList = ({ contentData }: PropTypes) => {
  return (
    <div>
      {contentData.title && contentData.poster_url && (
        <Image
          alt={`${contentData.title} poster`}
          width={200}
          height={400}
          className="h-32 w-24 rounded-md object-cover"
          loading="lazy"
          src={contentData.poster_url}
        />
      )}
    </div>
  )
}

export default ImageList
