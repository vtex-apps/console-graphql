import { filter, keys, startsWith } from 'ramda'

export const appsWithStats = async (root, args, ctx: Context, info) => {
  const {resources: {apps}, vtex: {account}} = ctx
  const deps = await apps.getDependencies().then(keys)
  // return filter(startsWith(account), deps)
  // TODO: remove comments before releasing !!!!!!!!
  return filter(startsWith('vtex'), deps)
}