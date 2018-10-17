import { Apps, ServiceContext } from '@vtex/api'

declare global {
  interface Context extends ServiceContext {
    resources: {
      apps: Apps
    }
  }
}

export {}