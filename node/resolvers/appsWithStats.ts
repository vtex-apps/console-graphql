import { filter, includes, map, pluck, prop } from 'ramda'


export const appsWithStats = async (root, args, ctx: Context, info) => {
  const {dataSources: {registry}, vtex: {account}} = ctx
  const publishedAppsInThisAccount = await registry.listApps()
    .then(prop('data'))
    .then(pluck('partialIdentifier'))
    .then(result => filter(includes(account), result))
    .then(result => {
      const accountStringLength = account.length
      return map(str => str.substring(accountStringLength + 1), result)})
    .then(result => result.sort())

  return publishedAppsInThisAccount
}
