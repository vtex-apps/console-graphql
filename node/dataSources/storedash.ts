import { forEachObjIndexed } from 'ramda'
import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { parse as parseCookie } from 'cookie'
import { adjust, curry, fromPairs, isEmpty, isNil, join, map, pipe, reject, replace, startsWith, toPairs } from 'ramda'


const isNilOrEmpty = x => isEmpty(x) || isNil(x)

const renameBy = (fn, obj) => (
    pipe(
      toPairs,
      map(adjust(0, fn)),
      fromPairs
    )(obj)
  )

const renameProperties = (pattern: string, data: any) => {
  const regex = new RegExp('^' + pattern)
  return map(obj => renameBy(replace(regex, ''), obj), data)
}

export class StoreDashDataSource extends RESTDataSource {
  constructor() {
    super()
  }

  public data = async (namespace: string, name: string, params: StoreDashInput) => {
    const {
      appName = '',
      appVersion = '',
      region = '',
      production = '',
      vendor = '',
      metricName = '',
      aggregateBy = [],
      fields = [],
      ...otherParams
    } = params || {}

    const transformed: any = reject(isNilOrEmpty, {
      'data.processEnv.appName': appName,
      'data.processEnv.appVersion': appVersion,
      'data.processEnv.region': region,
      'data.processEnv.production': production,
      'data.processEnv.vendor': vendor,
      'data.key.name': metricName,
      aggregateBy: join(',', aggregateBy),
      fields: join(',', fields),
      ...otherParams,
    })

    const responseData = await this.get(`/${namespace}/${name}?`, transformed)
    const responseDataRenamed = renameProperties('data.summary.', responseData)
    return responseDataRenamed
  }

  get baseURL() {
    const { vtex: { account } } = this.context
    return `http://api.vtex.com/api/storedash/metrics`
  }

  protected willSendRequest(request: RequestOptions) {
    const { header, vtex: { authToken } } = this.context
    const parsedCookies = parseCookie(header.cookie || '')
    const VtexIdclientAutCookie = parsedCookies.VtexIdclientAutCookie

    request.headers.set('X-Vtex-Use-Https', 'true')
    request.headers.set('VtexIdclientAutCookie', VtexIdclientAutCookie)
    request.headers.set('Proxy-Authorization', authToken)
  }
}


