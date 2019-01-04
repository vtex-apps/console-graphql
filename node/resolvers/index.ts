import { appsWithStats } from './appsWithStats'
import { data } from './data'
import { addSpecToLayout, layout, resetLayout, saveLayout, spec as specFieldResolver } from './layout'
import { createSpec, deleteSpec, spec, specs } from './spec'

export const resolvers = {
  Layout: {
    spec: specFieldResolver
  },
  Mutation: {
    addSpecToLayout,
    createSpec,
    deleteSpec,
    resetLayout,
    saveLayout,
  },
  Query: {
    appsWithStats,
    data,
    layout,
    spec,
    specs,
  },
}
