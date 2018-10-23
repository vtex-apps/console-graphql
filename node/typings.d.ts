import { Apps, ServiceContext, VBase } from '@vtex/api'
import { StoreDashDataSource } from './dataSources/storedash'

declare global {
  interface Context extends ServiceContext {
    dataSources: DataSources
  }
  
  interface DataSources {
    storeDash: StoreDashDataSource
    apps: Apps
    vbase: VBase
  }
  
  type Resolver<P, A, I, R> = (root: P, args: A, ctx: Context, info: I) => Promise<R>

  interface StoreDashInput {
    aggregateBy?: string[]
    fields?: string[]
    from: string
    interval?: string
    operation?: string
    size?: number
    timezone?: string
    to?: string
  }

  type Maybe<T> = T | void 

  interface Specs {
    [name: string]: string
  }

  interface SpecLocator {
    appId: string
    specName: string
  }

  interface Layout {
    specLocator: SpecLocator
    spec: String
  }

  interface LayoutContainer {
    cacheId: string
    layout: Layout[]
  }
}

export {}