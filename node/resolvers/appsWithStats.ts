import { removeVersionFromAppId } from '@vtex/api'
import { compose, filter, isEmpty, isNil, keys, map, reject, startsWith } from 'ramda'

const nullable = x => isEmpty(x) || isNil(x)

export const appsWithStats = async (root, args, ctx: Context, info) => {
  const {resources: {apps}, vtex: {account}} = ctx
  const deps = await apps.getDependencies().then(keys)
  // return filter(startsWith(account), deps)
  // TODO: remove comments before releasing !!!!!!!!
  return compose(
    reject(nullable),
    // map(removeVersionFromAppId),
    filter(startsWith('vtex'))
  )(deps)
}