interface Args {
  name: string,
  params: StoreDashInput
}

const NAMESPACE = 'colossus'

export const data = async (_, args: Args, ctx: Context) => {
  const {dataSources: {storeDash}} = ctx
  const {name, params} = args

  return storeDash.data(NAMESPACE, name, params)
    .then(JSON.stringify)
}
