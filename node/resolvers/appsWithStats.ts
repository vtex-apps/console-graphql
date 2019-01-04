import { filter, includes, map, pluck, prop } from 'ramda'


const filterAppNameByAccount = (appNameList: string[], accountName: string) => {
  const isVendorInApp = (appName: string) => {
    const appNamePart: string[] = appName.split('.')
    return accountName === appNamePart[0]
  }
  return filter(isVendorInApp, appNameList)
}

const removeAccountInAppName = (appNameList: string[], accountName: string) => {
  const accountNameLength = accountName.length
  return map(str => str.substring(accountNameLength + 1), appNameList)
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
