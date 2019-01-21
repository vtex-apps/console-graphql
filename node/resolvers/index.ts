import { appsWithStats } from './appsWithStats'
import { data } from './data'
import { addSpecToLayoutWithSpecs, layoutWithSpecs, resetLayoutWithSpecs, saveLayoutWithSpecs, spec as specFieldResolver } from './layoutWithSpecs'
import { createSpec, deleteSpec, spec, specs } from './spec'

export const resolvers = {
  LayoutWithSpecs: {
    spec: specFieldResolver
  },
  Mutation: {
    addSpecToLayoutWithSpecs,
    createSpec,
    deleteSpec,
    resetLayoutWithSpecs,
    saveLayoutWithSpecs,
  },
  Query: {
    appsWithStats,
    data,
    layoutWithSpecs,
    spec,
    specs,
  },
}
