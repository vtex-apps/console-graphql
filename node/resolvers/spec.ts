import { isValidAppIdOrLocator } from '@vtex/api'
import { ApolloError } from 'apollo-server-errors'
import { compose, flatten, keys, map, mapObjIndexed, partial, prop, values, zipObj } from 'ramda'

import { CUSTOM_SPEC_APP_ID, CUSTOM_SPEC_FILE, VBASE_BUCKET } from '../common/globals'
import { ignoreNotFound } from '../common/notFound'
import { appsWithSpecs, getSpec, getSpecs } from '../common/spec'

const maybeSpecsToSpecLocators = (maybeSpecs: Maybe<Specs>, appId: string) => maybeSpecs 
  ? compose(
    map((specName: string) => ({specName, appId})),
    keys
  )(maybeSpecs) as SpecLocator[]
  : [] 

export const specs = async (root, args: void, ctx: Context, info): Promise<SpecLocator[]> => {
  const {dataSources: {vbase, apps}} = ctx
  const appIdsWithStats = await appsWithSpecs(apps)
  const getSpecsForAppId = partial(getSpecs, [apps])

  const [appSpecs, maybeCustomSpecs] = await Promise.all([
    Promise.map(appIdsWithStats, getSpecsForAppId),
    vbase.getJSON<Maybe<Specs>>(VBASE_BUCKET, CUSTOM_SPEC_FILE, true)
  ])

  const specsByAppId = zipObj(appIdsWithStats, appSpecs)
  const appSpecsLocators = compose(
    flatten,
    values,
    mapObjIndexed(maybeSpecsToSpecLocators)
  )(specsByAppId) as SpecLocator[]

  const customSpecsLocators = maybeSpecsToSpecLocators(maybeCustomSpecs, CUSTOM_SPEC_APP_ID)
  
  console.log('implement UNIQ !!!')

  return [
    ...appSpecsLocators,
    ...customSpecsLocators
  ]
}

interface SpecArgs {
  specName: string
  appId?: string
}

export const spec = async (root, args: SpecArgs, ctx: Context, info) => {
  const {dataSources: {vbase, apps}} = ctx
  const {specName, appId} = args
  let found: string

  if (appId && isValidAppIdOrLocator(appId)) {
    found = await getSpec(apps, appId, specName)
  } else {
    const customSpecs = await vbase.getJSON<Specs>(VBASE_BUCKET, CUSTOM_SPEC_FILE, true)
    found = prop(specName, customSpecs)
  }
  
  if (!found) {
    throw new ApolloError(`Vega spec ${specName} was not found for app ${appId}`)
  }

  return JSON.stringify(found)
}

interface CreateSpecArgs {
  specName: string
  serializedSchema: string
}

export const createSpec = async (root, args: CreateSpecArgs, ctx: Context, info) => {
  const {dataSources: {vbase}} = ctx
  const {specName, serializedSchema} = args
  const customSpecs = await vbase.getJSON<Specs>(VBASE_BUCKET, CUSTOM_SPEC_FILE).catch(ignoreNotFound({}))

  if (customSpecs && customSpecs[specName]) { 
    throw new ApolloError(`Custom Vega spec with name ${specName} already exists`, 'ERR_SPEC_ALREADY_EXISTS')
  }

  customSpecs[specName] = serializedSchema

  return vbase.saveJSON(VBASE_BUCKET, CUSTOM_SPEC_FILE, customSpecs)
}

interface DeleteSpecArgs {
  specName: string
}

export const deleteSpec = async (root, args: DeleteSpecArgs, ctx: Context, info) => {
  const {dataSources: {vbase}} = ctx
  const {specName} = args
  const customSpecs = await vbase.getJSON<Specs>(VBASE_BUCKET, CUSTOM_SPEC_FILE).catch(ignoreNotFound({}))

  customSpecs[specName] = undefined

  return vbase.saveJSON(VBASE_BUCKET, CUSTOM_SPEC_FILE, customSpecs)
}