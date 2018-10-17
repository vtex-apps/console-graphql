import { Apps, LRUCache } from '@vtex/api'
import { map } from 'ramda'
import { appsWithStats } from './appsWithStats'
import { data } from './data'
import { spec } from './spec'

const cacheStorage = new LRUCache<string, any>({
  max: 1000
})

const prepare = (handler: any) => async (root, args, ctx: Context, info) => {
  const {vtex} = ctx
  ctx.resources.apps = new Apps(vtex, {cacheStorage})

  await handler(root, args, ctx, info)
}

export const resolvers = {
  Query: map(prepare, {
    appsWithStats,
    data,
    spec
  })
}