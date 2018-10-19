import { map } from 'ramda'

import { CUSTOM_SPEC_FILE, VBASE_BUCKET } from '../common/globals'
import { getLayoutFromAvailableApps } from '../common/layout'
import { ignoreNotFound } from '../common/notFound'
import { spec, specs } from './spec'

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

const getSpecLocatorsFile = (appName: string) => `${appName}.${CUSTOM_SPEC_FILE}`

export const layout = async (root: any, args: LayoutArgs, ctx: Context, info: any) => {
  const { appName } = args
  const { resources: { vbase }} = ctx

  const appSpecLocatorsFile = getSpecLocatorsFile(appName)

  const maybeAppSpecLocator = await vbase.getJSON(
    VBASE_BUCKET,
    appSpecLocatorsFile,
    true
  )

  const specLocators = maybeAppSpecLocator && maybeAppSpecLocator.specs
    || await specs(null, null, ctx, info)

  const layoutArray = await Promise.all(map(
      (specLocator) => ({
        spec: spec(null, specLocator, ctx, info),
        specLocator,
      }),
      specLocators
    )
  )

  return layoutArray
}

interface SaveLayoutArgs {
  appName: string
  specLocators: [SpecLocator]
}

export const saveLayout = async (root: any, args: SaveLayoutArgs, ctx: Context, info: any) => {
  const { appName, specLocators } = args
  const { resources: { vbase }} = ctx

  const appSpecLocatorsFile = getSpecLocatorsFile(appName)

  try {
    const response = await vbase.saveJSON(
      VBASE_BUCKET,
      appSpecLocatorsFile,
      {
        specs: specLocators,
      }
    )
  return true
  }
  catch (e) {
    console.error(e)
    return false
  }
}

interface ResetLayoutArgs {
  appName: string
}

export const resetLayout = async (root: any, args: SaveLayoutArgs, ctx: Context, info: any) => {
  const { appName, specLocators } = args
  const { resources: { vbase }} = ctx

  const appSpecLocatorsFile = getSpecLocatorsFile(appName)

  try {
    await vbase.deleteFile(
      VBASE_BUCKET,
      appSpecLocatorsFile
    )
    return true
  }
  catch (e) {
    console.error(e)
    return false
  }
}
