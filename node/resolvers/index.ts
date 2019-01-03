import { workspaces } from './workspaces'
import { appsWithStats } from './appsWithStats'
import { data } from './data'
import { income } from './income'
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
    income,
    layout,
    spec,
    specs,
    workspaces,
  },
}
