import { Apps, DiskCache, LRUCache, MultilayeredCache, parseAppId } from '@vtex/api'
import { find, findIndex, keys, partial, propEq } from 'ramda'

import { CACHE_PATH, CONSOLE_GRAPHQL, SPEC_PATH } from '../common/globals'
import { ignoreNotFound } from './notFound'
import { cacheKey, findBestMatching, toString } from './utils'

const layoutStorage = new MultilayeredCache<string, Maybe<Layout>>([
  new LRUCache({
    max: 100
  }),
  new DiskCache(CACHE_PATH)
])

const toLayout = (appId: string) => (appSpecs: Specs): Layout => {
  const {name: appName} = parseAppId(appId)
  return {
    appName,
    specs: appSpecs,
  }
}

const fetchLayout = (apps: Apps, appId: string) => (): Promise<Maybe<Layout>> => 
  apps.getAppFile(appId, SPEC_PATH)
  .then(toString)
  .then(JSON.parse)
  .then(toLayout(appId))
  .catch(ignoreNotFound(null))

const retriveLayout = (apps: Apps, appId: string): Promise<Maybe<Layout>> => 
  layoutStorage.get(cacheKey(appId), fetchLayout(apps, appId))



export const getAppLayout = async (apps: Apps, appName: string): Promise<Maybe<Layout>> => {
  const maybeAppsWithSpecs = await appsWithSpecs(apps)
  const appId = findBestMatching(appName, maybeAppsWithSpecs)
  return retriveLayout(apps, appId)
}

export const getLayoutFromAvailableApps = async (apps: Apps): Promise<Maybe<Array<Maybe<Layout>>>> => Promise.map(
  await appsWithSpecs(apps), 
  partial(retriveLayout, [apps])
)

export const findLayoutByAppName = (appName: string, layout: Layout[]): Maybe<Layout> => 
  find(propEq('appName', appName), layout) as any

export const findLayoutIndexByAppName = (appName: string, layout: Layout[]): Maybe<number> => 
  findIndex(propEq('appName', appName), layout) as any