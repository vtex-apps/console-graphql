import { appsWithStats } from './appsWithStats'
import { data } from './data'

export const resolvers = {
  Query: {
    appsWithStats,
    data,
  },
}
