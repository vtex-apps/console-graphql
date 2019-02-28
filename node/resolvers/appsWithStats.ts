import { filter, map, pluck, prop, replace, startsWith } from 'ramda'

const filterAppNameByAccount = (appNameList: string[], accountName: string) => {
  return filter(startsWith(accountName), appNameList)
}

const removeAccountInAppName = (appNameList: string[], accountName: string) => {
  return map(replace(accountName + '.', ''), appNameList)
}

export const appsWithStats = async (root, args, ctx: Context, info) => {
  const {dataSources: {registry}, vtex: {account}} = ctx
  const publishedAppsInThisAccount = await registry.listApps()
    .then(prop('data'))
    .then(pluck('partialIdentifier'))
    .then(result => filterAppNameByAccount(result, account))
    .then(result => removeAccountInAppName(result, account))
    .then(result => result.sort())

  return publishedAppsInThisAccount
}
