import { Content } from '@/payload-types'
import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

import { DOMAIN_NAME } from '@/lib/constants'

type PropTypes = {
  contentData: Content
}

const ImageList = async ({ contentData }: PropTypes) => {
  const media = typeof contentData.media === 'number' ? null : contentData.media
  const category = typeof contentData.category === 'string' ? null : contentData.category
  const aspectRatio = category?.image_ratio ?? null

  const url = contentData.media ? `${DOMAIN_NAME}${media?.url}` : contentData.poster_url
  console.log(url)
  return (
    <div
      className={cn(
        'relative w-full border-4 border-foreground z-20 h-full',
        aspectRatio === '2/3' && 'aspect-2/3',
        aspectRatio === '1/1' && 'aspect-square',
      )}
    >
      {url && (
        <Image
          alt={`${contentData.title || 'Media'} poster`}
          src={url}
          fill
          sizes="100%"
          className="object-cover"
          priority={false}
        />
      )}
    </div>
  )
}

export default ImageList
