import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { isEmpty, isNil, join, reject } from 'ramda'
import { parse as parseCookie } from 'cookie'

const isNilOrEmpty = x => isEmpty(x) || isNil(x)

export class StoreDashDataSource extends RESTDataSource {
  constructor() {
    super()
  }

  public data = (namespace: string, name: string, params: StoreDashInput) => {
    console.log('\nNAMESPACE\n', namespace, '\nNAMESPACE\n')
    console.log('\nNAME\n', name, '\nNAME\n')
    console.log('\nPARAMS\n', params, '\nPARAMS\n')
    const {vtex: {account}} = this.context
    const {aggregateBy = [], fields = []} = params || {}
    const transformed: any = reject(isNilOrEmpty, {
      ...params,
      aggregateBy: join(',', aggregateBy),
      fields: join(',', fields),
    })
    console.log('\nTRANSFORMED\n', transformed, '\nTRANSFORMED\n')

    // Query GET SUM TIME SERIES MEMORY USAGE
    // return this.get(`http://api.vtex.com/api/storedash/${account}/metrics/storedash/sessioncube?from=now-5h&to=now&interval=1h&operation=sum&fields=data.orders&accountName=${account}&data.browser=Chrome`, transformed)
    return this.get(`https://boticario.myvtex.com/api/storedash/boticario/metrics/storedash/sessions?from=2018-10-03T03:00:00.000Z&to=now&timezone=-02:00&interval=1h&operation=sum&aggregateBy=data.isMobile`, transformed)

    // return this.get('http://api.vtex.com/api/storedash/storecomponents/metrics/storedash/sessioncube?from=now-24h&to=now&interval=1h&operation=sum&fields=data.orders&accountName=storecomponents', transformed)
    // // Query GET COUNT TIME SERIES MEMORY USAGE
    // return this.get('http://api.vtex.com/api/storedash/boticario/metrics/storedash/sessioncube?from=now-24h&to=now&interval=1h&operation=sum&fields=count&accountName=boticario&data.browser=Chrome', transformed)

    return this.get(`/${namespace}/${name}`, transformed)
  }

  get baseURL() {
    const {vtex: {account}} = this.context
    return `http://api.vtex.com/api/storedash/${account}/metrics`
  }

  protected willSendRequest(request: RequestOptions) {
    const {header, vtex: {authToken}} = this.context
    console.log('\nCONTEXT\n', this.context, '\nCONTEXT\n')
    console.log('\nHEADER.COOKIE\n', header.cookie, '\nHEADER.COOKIE\n')

    const parsedCookies = parseCookie(header.cookie || '')
    console.log('\nparsedCookies\n', parsedCookies, '\nparsedCookies\n')

    const VtexIdclientAutCookie = parsedCookies.VtexIdclientAutCookie
    console.log('\nVtexIdclientAutCookie\n', VtexIdclientAutCookie, '\nVtexIdclientAutCookie\n')

    // request.headers.set('X-Vtex-Use-Https', 'true')
    request.headers.set('X-Vtex-Use-Https', 'true')
    request.headers.set('VtexIdclientAutCookie', VtexIdclientAutCookie)
    request.headers.set('Proxy-Authorization', authToken)
    // request.headers.set('Cookie', header.cookie)
  }
}
