import { Apps, DiskCache, LRUCache, MultilayeredCache, VBase } from '@vtex/api'
import { map } from 'ramda'

import { CACHE_PATH } from '../common/globals'
import { appsWithStats } from './appsWithStats'
import { data } from './data'
import { layout } from './layout'
import { saveSpec } from './saveSpec'
import { saveSpecLayoutForAppName } from './saveSpecLayoutForAppName'
import { spec } from './spec'

const cacheStorage = new MultilayeredCache([
  new LRUCache<string, any>({
    max: 1000
  }),
  new DiskCache(CACHE_PATH)
])


const prepare = <P, A, I, R>(handler: Resolver<P, A, I, R>) => (root: P, args: A, ctx: Context, info: I): Promise<R> => {
  const {vtex} = ctx
  ctx.resources = {
    apps: new Apps(vtex, {cacheStorage}),
    vbase: new VBase(vtex, {cacheStorage})
  }

  return handler(root, args, ctx, info)
}

export const resolvers = {
  Mutation: map(prepare, {
    saveSpec,
    saveSpecLayoutForAppName,
  }),
  Query: map(prepare, {
    appsWithStats,
    data,
    layout,
    spec,
  }),
}