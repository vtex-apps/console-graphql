import { map, objOf, pluck, prop } from 'ramda'

import { CUSTOM_SPEC_FILE, VBASE_BUCKET } from '../common/globals'
import { spec as specResolver, specs } from './spec'

interface LayoutArgs {
  appName: string
}

const getSpecLocatorsFile = (appName: string) => `${appName}.${CUSTOM_SPEC_FILE}`

export const layout = async (root: any, args: LayoutArgs, ctx: Context, info: any): Promise<LayoutContainer> => {
  const { appName } = args
  const { resources: { vbase }} = ctx

  const appSpecLocatorsFile = getSpecLocatorsFile(appName)
  
  const maybeAppSpecLocator = await vbase.getJSON(
    VBASE_BUCKET,
    appSpecLocatorsFile,
    true
  ) as any

  const specLocators = maybeAppSpecLocator && maybeAppSpecLocator.specs
    || await specs(null, null, ctx, info) 

  return {
    cacheId: appName,
    layout: map(objOf('specLocator'), specLocators) as Layout[]
  }
}

export const spec = async ({specLocator}: any, args: LayoutArgs, ctx: Context, info: any) => specResolver(null, specLocator, ctx, info)

interface AddSpecToLayoutArgs {
  appName: string
  specLocator: SpecLocator
}

const toArray = <T>(x: T | T[]): T[] => Array.isArray(x) ? x : [x]

export const addSpecToLayout = async (root, args: AddSpecToLayoutArgs, ctx: Context, info) => {
  const {appName, specLocator} = args
  const oldSpecs = await layout(root, {appName}, ctx, info).then(prop('layout')).then(pluck('specLocator')).then(toArray) as SpecLocator[]
  const newSpecs = oldSpecs.concat(specLocator)
  return saveLayout(root, {appName, specLocators: newSpecs}, ctx, info)
}

interface SaveLayoutArgs {
  appName: string
  specLocators: SpecLocator[]
}

export const saveLayout = async (root: any, args: SaveLayoutArgs, ctx: Context, info: any) => {
  const { appName, specLocators } = args
  const { resources: { vbase }} = ctx

  const appSpecLocatorsFile = getSpecLocatorsFile(appName)

  try {
    await vbase.saveJSON(VBASE_BUCKET, appSpecLocatorsFile, {
      specs: specLocators,
    })
  }
  catch (e) {
    console.error(e)
  }
  return layout(root, {appName}, ctx, info)
}

interface ResetLayoutArgs {
  appName: string
}

export const resetLayout = async (root: any, args: ResetLayoutArgs, ctx: Context, info: any) => {
  const { appName } = args
  const { resources: { vbase }} = ctx

  const appSpecLocatorsFile = getSpecLocatorsFile(appName)

  try {
    await vbase.deleteFile(VBASE_BUCKET, appSpecLocatorsFile)
  }
  catch (e) {
    console.error(e)
  }
  return layout(root, {appName}, ctx, info)
}
