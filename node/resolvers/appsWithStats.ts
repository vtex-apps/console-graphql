import { removeVersionFromAppId } from '@vtex/api'
import { compose, filter, has, includes, isEmpty, isNil, keys, map, pluck, prop, reject, startsWith  } from 'ramda'

const nullable = x => isEmpty(x) || isNil(x)


export const appsWithStats = async (root, args, ctx: Context, info) => {
  // #TODO: rever por que não está autorizando o registry
  // const {dataSources: {registry}, vtex: {account}} = ctx
  // console.log('\n--account\n', account, '\n--account\n')
  // console.log('\n--registry\n', registry, '\n--registry\n')
  // const publishedAppsInThisAccount = await registry.listApps()
  //   .then(prop('data'))
  //   .then(pluck('partialIdentifier'))
  //   .then(result => filter(includes(account), result))
  // console.log('filter apps\n', publishedAppsInThisAccount)
  // return publishedAppsInThisAccount

  const {dataSources: {apps}, vtex: {account}} = ctx
  console.log('\n-APPS\n')
  // console.log('\n--ctx--\n', ctx, '\n--ctx--\n')
  const VtexIdclientAutCookie = ctx.cookies.get('VtexIdclientAutCookie')
  // console.log('VtexIdclientAutCookie ', VtexIdclientAutCookie)
  // console.log('\n--apps\n', apps, '\n--apps\n')
  const deps = await apps.getDependencies().then(keys)
  const res = compose(
    reject(nullable),
    map(removeVersionFromAppId)
    // filter(startsWith(account))
  )(deps)
  // console.log('\nRES\n', res, '\nRES\n')
  return res
}
