import { isValidAppIdOrLocator, parseAppId } from '@vtex/api'
import { ApolloError } from 'apollo-server-errors'
import { compose, head, prop, split } from 'ramda'

const vendorFromAppId = compose(
  head,
  split('.'),
  prop('name'),
  (appId: string) => parseAppId(appId)
)

interface Args {
  appId: string, 
  name: string, 
  params: StoreDashInput
}

const NAMESPACE = 'gateway'

export const data = async (root, args: Args, ctx: Context, info) => {
  const {dataSources: {storeDash}, vtex: {account}} = ctx
  const {appId, name, params} = args

  if (!isValidAppIdOrLocator(appId)) {
    throw new ApolloError(`App ${appId} is not a valid appId`)
  }

  // const vendor = vendorFromAppId(appId)

  // if (vendor !== account) {
  //   throw new ApolloError(`Vendor ${account} cannot read metrics of vendor ${vendor}`)
  // }

  return storeDash.data(NAMESPACE, name, params).then(JSON.stringify)
}