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
  // params: StoreDashInput
  params: string
}

const NAMESPACE = 'gateway'

const ddd = () => ({
  "table": [
    {"category": "A", "amount": Math.floor(Math.random() * 50)},
    {"category": "B", "amount": Math.floor(Math.random() * 50)},
    {"category": "C", "amount": Math.floor(Math.random() * 50)},
    {"category": "D", "amount": Math.floor(Math.random() * 50)},
    {"category": "E", "amount": Math.floor(Math.random() * 50)},
    {"category": "F", "amount": Math.floor(Math.random() * 50)},
    {"category": "G", "amount": Math.floor(Math.random() * 50)},
    {"category": "H", "amount": Math.floor(Math.random() * 50)}
  ]
 })

export const data = async (root, args: Args, ctx: Context, info) => {
  const {dataSources: {storeDash}, vtex: {account}} = ctx
  const {appId, name, params} = args
  const parsedParams = JSON.parse(params)

  // if (!isValidAppIdOrLocator(appId)) {
  //   throw new ApolloError(`App ${appId} is not a valid appId`)
  // }

  // const vendor = vendorFromAppId(appId)

  // if (vendor !== account) {
  //   throw new ApolloError(`Vendor ${account} cannot read metrics of vendor ${vendor}`)
  // }

  // return storeDash.data(NAMESPACE, name, params).then(JSON.stringify)
  const MOCK_RESPONSE = {
    'table': [
      {'category': 'A', 'amount': 28},
      {'category': 'B', 'amount': 55},
      {'category': 'C', 'amount': 43},
      {'category': 'D', 'amount': 91},
      {'category': 'E', 'amount': 81},
      {'category': 'F', 'amount': 53},
      {'category': 'G', 'amount': 19},
      {'category': 'H', 'amount': 87}
    ]
  }
  // return JSON.stringify(MOCK_RESPONSE)
  return JSON.stringify(ddd())
}