import { Apps, DiskCache, LRUCache, MultilayeredCache } from '@vtex/api'
import { keys, reduce, merge } from 'ramda'

const CONSOLE_GRAPHQL = 'vtex.console-graphql@0.x'

interface Args {
  name: string
}

const CACHE_PATH = '/cache/console-immutable-assets/v0'
const SPEC_PATH = 'dist/vtex.console-graphql/spec0x.vega.json'

const specStorage = new MultilayeredCache<string, any>([
  new LRUCache({
    max: 100
  }),
  new DiskCache(CACHE_PATH)
])

const cacheKey = (app: string) => `${app}/${SPEC_PATH}`.replace(/\W/g, '_')

const ignoreNotFound = <T>(fallback: T) => (error: any): T => {
  if (error.response && error.response.status === 404) {
    return fallback
  }
  throw error
}

const toString = ({data}: {data: Buffer}) => data.toString()

const fetchJsonSpec = (apps: Apps, app: string) => () => 
  apps.getAppFile(app, SPEC_PATH)
  .then(toString)
  .then(JSON.parse)
  .catch(ignoreNotFound(null))

export const spec = async (root: any, args: Args, ctx: Context, info: any) => {
  const {resources: {apps}}  = ctx
  const {name} = args
  const maybeAppsWithSpecs = await apps.getDependencies(CONSOLE_GRAPHQL).then(keys)

  const specs = await Promise.map(
    maybeAppsWithSpecs,
    (app: string) => specStorage.get(cacheKey(app), fetchJsonSpec(apps, app))
  )
  
  const specsObj: any = reduce(merge, {}, specs)
  
  const spec = specsObj[name]
  
  if (spec) { 
    return spec
  }

  throw new ApolloError
}
