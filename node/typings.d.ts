import { Apps, Registry, ServiceContext, VBase } from '@vtex/api'
import { StoreDashDataSource } from './dataSources/storedash'

declare global {
  interface Context extends ServiceContext {
    dataSources: DataSources
  }

  interface DataSources {
    storeDash: StoreDashDataSource
    apps: Apps
    vbase: VBase
    registry: Registry
  }

  type Resolver<P, A, I, R> = (root: P, args: A, ctx: Context, info: I) => Promise<R>

  interface StoreDashInput {
    appName: string
    appVersion?: string
    region?: 'aws-us-east-1' | 'aws-us-east-2'
    production?: boolean
    metricName: string
    from: string
    to: string
    interval?: string
    operation?: string
    fields?: string[]
    aggregateBy?: string[]
    size?: number
    timezone?: string
  }

  type Maybe<T> = T | void

  interface Specs {
    [name: string]: string
  }

  interface SpecLocator {
    appId: string
    specName: string
  }

  interface LayoutWithSpecs {
    specLocator: SpecLocator
    spec: String
  }

  interface LayoutWithSpecsContainer {
    cacheId: string
    layoutWithSpecs: LayoutWithSpecs[]
  }
}

export {}
