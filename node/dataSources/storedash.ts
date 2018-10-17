import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { isEmpty, isNil, join, reject } from 'ramda'

const isNilOrEmpty = x => isEmpty(x) || isNil(x)

export class StoreDashDataSource extends RESTDataSource {
  constructor() {
    super()
  }

  public data = (namespace: string, name: string, params: StoreDashInput) => {
    const {aggregateBy = [], fields = []} = params || {}
    const transformed: any = reject(isNilOrEmpty, {
      ...params,
      aggregateBy: join(',', aggregateBy),
      fields: join(',', fields),
    })
    return this.get(`/${namespace}/${name}`, transformed)
  }

  get baseURL() {
    const {vtex: {account}} = this.context
    return `http://api.vtex.com/api/storedash/${account}/metrics`
  }

  protected willSendRequest(request: RequestOptions) {
    const {header, vtex: {authToken}} = this.context
    request.headers.set('X-Vtex-Use-Https', 'true')
    request.headers.set('X-Vtex-Use-Https', 'true')
    request.headers.set('Proxy-Authorization', authToken)
    request.headers.set('Cookie', header.cookie)
  }
}