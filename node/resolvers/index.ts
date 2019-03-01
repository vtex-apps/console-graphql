import { appsWithStats } from './appsWithStats'
import { appVersions } from './appVersions'
import { data } from './data'

export const resolvers = {
  Query: {
    appVersions,
    appsWithStats,
    data,
  },
}
