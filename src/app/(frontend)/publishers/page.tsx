import { createPayload } from '@/utils/payload'
import React from 'react'

const PublishersPage = async () => {
  const payload = await createPayload()

  const data = await payload.find({
    collection: 'publisher',
    pagination: false,
  })

  const publisherList = data.docs

  return (
    <div className="flex flex-col space-y-3">
      <h1>Publishers</h1>
      <h2>This is a currated list of all the publishers so far.</h2>
      <div className="flex flex-col">
        {publisherList.map((publisher) => {
          return <div key={publisher.id}>{publisher.name}</div>
        })}
      </div>
    </div>
  )
}

export default PublishersPage
