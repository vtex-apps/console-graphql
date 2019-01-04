import { removeVersionFromAppId } from '@vtex/api'
import { compose, filter, has, includes, isEmpty, isNil, keys, map, pluck, prop, reject, sort, startsWith  } from 'ramda'

const nullable = x => isEmpty(x) || isNil(x)


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
