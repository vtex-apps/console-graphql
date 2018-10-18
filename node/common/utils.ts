import { find, startsWith } from 'ramda'

import { SPEC_PATH } from './globals'

export const findBestMatching = (appName: string, appIds: string[]) => find(startsWith(appName), appIds)

export const normalizeAppName = (appName: string) => appName.replace(/\W/g, '_')

export const cacheKey = (app: string) => `${app}/${SPEC_PATH}`.replace(/\W/g, '_')

export const toString = ({data}: {data: Buffer}) => data.toString()

