import { forEachObjIndexed } from 'ramda'
import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { parse as parseCookie } from 'cookie'
import { isEmpty, isNil, join, reject } from 'ramda'
import { data } from '../resolvers/data'

const isNilOrEmpty = x => isEmpty(x) || isNil(x)

export class StoreDashDataSource extends RESTDataSource {
  constructor() {
    super()
  }

  public data = (namespace: string, name: string, params: StoreDashInput) => {
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

    console.log({ transformed })

    return this.get(`/${namespace}/${name}?`, transformed)
  }

  get baseURL() {
    const {vtex: {account}} = this.context
    return `http://api.vtex.com/api/storedash/metrics`
  }

  protected willSendRequest(request: RequestOptions) {
    const {header, vtex: {authToken}} = this.context
    const parsedCookies = parseCookie(header.cookie || '')
    const VtexIdclientAutCookie = parsedCookies.VtexIdclientAutCookie

    request.headers.set('X-Vtex-Use-Https', 'true')
    request.headers.set('VtexIdclientAutCookie', VtexIdclientAutCookie)
    request.headers.set('Proxy-Authorization', authToken)
  }
}


