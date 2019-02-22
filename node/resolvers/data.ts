interface Args {
  namespace: string,
  name: string,
  params: StoreDashInput
  transformationType: string
}

export const data = async (_, args: Args, ctx: Context) => {
  const { dataSources: { storeDash } } = ctx
  const { namespace, name, params, transformationType } = args

  return storeDash.data(namespace, name, params, transformationType)
    .then(JSON.stringify)
}
