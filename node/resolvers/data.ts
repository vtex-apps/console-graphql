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
  name: string,
  params: StoreDashInput
}

const NAMESPACE = 'colossus'

export const data = async (root, args: Args, ctx: Context, info) => {
  const {dataSources: {storeDash}, vtex: {account}} = ctx
  const {name, params} = args

  // Comentado por enquanto para testar o front
  // if (!isValidAppIdOrLocator(appId)) {
  //   throw new ApolloError(`App ${appId} is not a valid appId`)
  // }

  // const vendor = vendorFromAppId(appId)

  // if (vendor !== account) {
  //   throw new ApolloError(`Vendor ${account} cannot read metrics of vendor ${vendor}`)
  // }

  return storeDash.data(NAMESPACE, name, params)
    .then(data => {
      console.log(data)
      return data
    })
    .then(JSON.stringify)
}
