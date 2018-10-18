import { getLayoutFromAvailableApps } from '../common/layout'
import { ignoreNotFound } from '../common/notFound'

interface Args {
  appName: string
}

// const normalizeAppName = (appName: string) => appName.replace(/\W/g, '_')

// export const layout = async (root: any, args: Args, ctx: Context, info: any): Promise<Maybe<Array<Maybe<Layout>>>> => {
//   const {resources: {apps, vbase}}  = ctx
//   const {appName} = args
//   const normalizedAppName = normalizeAppName(appName)

//   const customLayout = await vbase.getJSON<Maybe<Layout[]>>('console', normalizedAppName).catch(ignoreNotFound<void>(null))

//   return customLayout ? customLayout : await getLayoutFromAvailableApps(apps)
// }

interface LayoutArgs {
  appName: string
}

export const layout = async (root: any, args: LayoutArgs, ctx: Context, info: any) => {
  return null
}

interface SaveLayoutArgs {
  appName: string
  specLocators: [SpecLocator]
}

export const saveLayout = async (root: any, args: SaveLayoutArgs, ctx: Context, info: any) => {
  return null
}

interface ResetLayoutArgs {
  appName: string
}

export const resetLayout = async (root: any, args: SaveLayoutArgs, ctx: Context, info: any) => {
  return null
}