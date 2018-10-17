import { StoreDashDataSource } from './storedash'

export const dataSources = () => ({
  storeDash: new StoreDashDataSource()
})