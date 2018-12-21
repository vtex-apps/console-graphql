import { removeVersionFromAppId } from '@vtex/api'
import { compose, filter, isEmpty, isNil, keys, map, reject, startsWith } from 'ramda'

const nullable = x => isEmpty(x) || isNil(x)

export const appsWithStats = async (root, args, ctx: Context, info) => {
  const {dataSources: {apps}, vtex: {account}} = ctx
  const deps = await apps.getDependencies().then(keys)
  return compose(
    reject(nullable),
    map(removeVersionFromAppId),
    filter(startsWith(account))
  )(deps)
}
