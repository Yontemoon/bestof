import config from '@/payload.config'
import { getPayload } from 'payload'

const createPayload = async () => {
  const payloadConfig = await config
  return getPayload({ config: payloadConfig })
}

export { createPayload }
