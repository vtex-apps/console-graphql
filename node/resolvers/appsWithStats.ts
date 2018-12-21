import { removeVersionFromAppId } from '@vtex/api'
import { compose, filter, has, isEmpty, isNil, keys, map, prop, reject, startsWith, pluck } from 'ramda'

const nullable = x => isEmpty(x) || isNil(x)

export const appsWithStats = async (root, args, ctx: Context, info) => {
  const {dataSources: {apps}, vtex: {account}} = ctx
  const deps = await apps.getDependencies().then(keys)
  console.log('--deps--\n', deps, '\n--deps--')
  // const installedApps = await apps.listApps().then((result) => {
    // console.log('result from promise listApps ', result)
    // console.log('primeiro dado ', result.data[0])
    // console.log('select value from data ', prop(data, result))
    // console.log('has key data? ', has(result))
    // return compose(
    //   map(obj => prop('app', obj)),
    //   prop('data')
    // )(result)

  console.log('bla')
  const installedApps = await apps.listApps()
    .then(prop('data'))
    .then(pluck('app'))
  console.log(installedApps)
  // console.log('--result apps--\n', res, '\n--result apps\n')
  // console.log('--installed apps--\n', installedApps, '\n--installed apps\n')
  return compose(
    reject(nullable),
    map(removeVersionFromAppId),
    filter(startsWith(account))
  )(deps)
}
