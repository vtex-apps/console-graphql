interface Args {
  appId: string, 
  name: string, 
  params: StoreDashInput
}

const NAMESPACE = 'gateway'

export const data = async (root, args: Args, ctx: Context, info) => {
  const {dataSources: {storeDash}} = ctx
  const {appId, name, params} = args

  // return storeDash.data(NAMESPACE, name, params).then(JSON.stringify)
  return storeDash.data(NAMESPACE, 'paymentauthorization', params).then(JSON.stringify)
}