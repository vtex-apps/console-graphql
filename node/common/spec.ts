import { Apps, DiskCache, FetchResult, LRUCache,MultilayeredCache } from '@vtex/api'
import { keys, objOf, prop } from 'ramda'

import { CACHE_PATH, CONSOLE_GRAPHQL, SPEC_PATH } from './globals'
import { ignoreNotFound } from './notFound'
import { cacheKey, toString } from './utils'


const specStorage = new MultilayeredCache<string, Maybe<Specs>>([
  new LRUCache({
    max: 100,
  }),
  new DiskCache(CACHE_PATH),
])

const fetchSpec = (apps: Apps, appId: string) => (): Promise<FetchResult<Maybe<Specs>>> =>
  apps.getAppFile(appId, SPEC_PATH)
  .then(toString)
  .then(JSON.parse)
  .then(objOf('value'))
  .catch(ignoreNotFound(null))

export const getSpecs = (apps: Apps, appId: string) =>
  specStorage.get(cacheKey(appId), fetchSpec(apps, appId))

export const getSpec = (apps: Apps, appId: string, specName: string): Promise<string> =>
  getSpecs(apps, appId).then(prop(specName))

export const appsWithSpecs = (apps: Apps) => apps.getDependencies(CONSOLE_GRAPHQL).then(keys)
