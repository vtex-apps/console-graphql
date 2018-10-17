import { Apps, ServiceContext } from '@vtex/api'
import { StoreDashDataSource } from './dataSources/storedash'

declare global {
  interface Context extends ServiceContext {
    resources: {
      apps: Apps
    }
    dataSources: DataSources
  }

  interface DataSources {
    storeDash: StoreDashDataSource
  }
  
  type Resolver<P, A, I, R> = (root: P, args: A, ctx: Context, info: I) => Promise<R>

  interface StoreDashInput {
    aggregateBy?: [string]
    fields?: [string]
    from: string
    interval?: string
    operation?: string
    size?: number
    timezone?: string
    to?: string
  }
}

export {}