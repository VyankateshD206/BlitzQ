import { MiddlewareHandler } from 'hono'
import { Bindings, Variables } from '@repo/types/index'

export const rateLimit = (
  limit = 10,
  windowSeconds = 60
): MiddlewareHandler<{ Bindings: Bindings; Variables: Variables }> => {
  return async (c, next) => {
    const ip = c.req.header('CF-Connecting-IP') || 'unknown'
    const key = `rate_limit:${ip}`
    const now = Math.floor(Date.now() / 1000)
    const bucketKey = `${key}:${Math.floor(now / windowSeconds)}`
    const kv = c.env.blitzq_kv

    const countRaw = await kv.get(bucketKey)
    const count = countRaw ? parseInt(countRaw) : 0

    if (count >= limit) {
      return c.json({success: false, message: 'Too many requests'}, 429)
    }

    await kv.put(bucketKey, (count + 1).toString(), {
      expirationTtl: windowSeconds
    })

    await next()
  }
}
