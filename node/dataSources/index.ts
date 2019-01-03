import { Apps, DiskCache, LRUCache, MultilayeredCache, Registry, VBase } from '@vtex/api'
import { StoreDashDataSource } from './storedash'

import { CACHE_PATH } from '../common/globals'

const cacheStorage = new MultilayeredCache([
  new LRUCache<string, any>({
    max: 1000,
  }),
  new DiskCache(CACHE_PATH),
])

export const dataSources = () => ({
  apps: new Apps(null, {cacheStorage}),
  registry: new Registry(null, {cacheStorage}),
  storeDash: new StoreDashDataSource(),
  vbase: new VBase(null, {cacheStorage}),
})
