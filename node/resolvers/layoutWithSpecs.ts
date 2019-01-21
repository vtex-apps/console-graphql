import { map, objOf, pluck, prop } from 'ramda'

import { CUSTOM_SPEC_FILE, VBASE_BUCKET } from '../common/globals'
import { spec as specResolver, specs } from './spec'

interface LayoutWithSpecsArgs {
  appName: string
}

const getSpecLocatorsFile = (appName: string) => `${appName}.${CUSTOM_SPEC_FILE}`

export const layoutWithSpecs = async (root: any, args: LayoutWithSpecsArgs, ctx: Context, info: any): Promise<LayoutWithSpecsContainer> => {
  const { appName } = args
  const { dataSources: { vbase }} = ctx

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
    layoutWithSpecs: map(objOf('specLocator'), specLocators) as LayoutWithSpecs[]
  }
}

export const spec = async ({specLocator}: any, args: LayoutWithSpecsArgs, ctx: Context, info: any) => specResolver(null, specLocator, ctx, info)

interface AddSpecToLayoutWithSpecsArgs {
  appName: string
  specLocator: SpecLocator
}

const toArray = <T>(x: T | T[]): T[] => Array.isArray(x) ? x : [x]

export const addSpecToLayoutWithSpecs = async (root, args: AddSpecToLayoutWithSpecsArgs, ctx: Context, info) => {
  const {appName, specLocator} = args
  const oldSpecs = await layoutWithSpecs(root, {appName}, ctx, info).then(prop('layoutWithSpecs')).then(pluck('specLocator')).then(toArray) as SpecLocator[]
  const newSpecs = oldSpecs.concat(specLocator)
  return saveLayoutWithSpecs(root, {appName, specLocators: newSpecs}, ctx, info)
}

interface SaveLayoutWithSpecsArgs {
  appName: string
  specLocators: SpecLocator[]
}

export const saveLayoutWithSpecs = async (root: any, args: SaveLayoutWithSpecsArgs, ctx: Context, info: any) => {
  const { appName, specLocators } = args
  const { dataSources: { vbase }} = ctx

  const appSpecLocatorsFile = getSpecLocatorsFile(appName)

  try {
    await vbase.saveJSON(VBASE_BUCKET, appSpecLocatorsFile, {
      specs: specLocators,
    })
  }
  catch (e) {
    console.error(e)
  }
  return layoutWithSpecs(root, {appName}, ctx, info)
}

interface ResetLayoutWithSpecsArgs {
  appName: string
}

export const resetLayoutWithSpecs = async (root: any, args: ResetLayoutWithSpecsArgs, ctx: Context, info: any) => {
  const {appName} = args
  const {dataSources: { vbase }} = ctx

  const appSpecLocatorsFile = getSpecLocatorsFile(appName)

  try {
    await vbase.deleteFile(VBASE_BUCKET, appSpecLocatorsFile)
  }
  catch (e) {
    console.error(e)
  }
  return layoutWithSpecs(root, {appName}, ctx, info)
}
