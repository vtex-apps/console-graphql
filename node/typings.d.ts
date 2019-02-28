import { Registry, ServiceContext } from '@vtex/api'
import { StoreDashDataSource } from './dataSources/storedash'

declare global {
  interface Context extends ServiceContext {
    dataSources: DataSources
  }

  interface DataSources {
    storeDash: StoreDashDataSource
    registry: Registry
  }

  interface StoreDashInput {
    appName: string
    appVersion?: string
    region?: 'aws-us-east-1' | 'aws-us-east-2'
    production?: string
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
}
