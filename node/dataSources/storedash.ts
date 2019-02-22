import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { parse as parseCookie } from 'cookie'
import { addMeanProperty, getTransformedParams, renameProperties, transformDataFormat } from './utils'


export class StoreDashDataSource extends RESTDataSource {
  constructor() {
    super()
  }

  public data = async (namespace: string, name: string, params: StoreDashInput, transformationType: string) => {
    const transformedParams: any = getTransformedParams(params)
    let responseData = await this.get(`/${namespace}/${name}?`, transformedParams)
    responseData = renameProperties('data.', responseData)
    addMeanProperty(responseData, params.metricName)
    responseData = transformDataFormat(responseData, transformedParams, transformationType)
    return responseData
  }

  get baseURL() {
    const { vtex: { account } } = this.context
    return `http://api.vtex.com/api/storedash/${account}/metrics`
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


