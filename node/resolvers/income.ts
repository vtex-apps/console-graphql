import axios from 'axios'
import { compose, pluck, prop } from 'ramda'

import Fetcher from '../common/fetcher'
import paths from '../common/paths'

interface Args {
  appId: string,
  name: string,
  params: StoreDashInput
}

const NAMESPACE = 'colossus'

export const income = async (root, args: Args, ctx: Context, info) => {
  console.log('\n-INCOME-\n')

  const {vtex: { account, authToken }} = ctx
  // console.log('\n--ctx--\n', ctx, '\n--ctx--\n')

  const VtexIdclientAutCookie = ctx.cookies.get('VtexIdclientAutCookie')
  // console.log('VtexIdclientAutCookie ', VtexIdclientAutCookie)

  // -- Request usando fetcher do Napoli
  // const fetcher = new Fetcher(ctx)
  // const { data } = await fetcher.get(paths.income(account, {from: 'now-24', to: 'now'}))
  // console.log('income ', data)

  // -- Request usando axios direto (jeito do Igor)

  // const url = `${account}.myvtex.com/api/storedash/${account}/metrics/storedash/sessioncube?from=now-24h&to=now&interval=1h&operation=sum&fields=data.orders&accountName=${account}&data.browser=Chrome`
  // const url = 'http://api.vtex.com/api/storedash/storecomponents/metrics/storedash/sessioncube?from=now-5h&to=now&interval=1h&operation=sum&fields=data.orders&accountName=storecomponents&data.browser=Chrome'
  const url = `boticario.myvtex.com/api/storedash/boticario/metrics/storedash/sessions?from=2018-10-03T03:00:00.000Z&to=now&timezone=-02:00&interval=1h&operation=sum&aggregateBy=data.isMobile`

  const headers = {
    'Proxy-Authorization': authToken,
    VtexIdclientAutCookie,
    'X-Vtex-Use-Https': true,
  }

  const config = {
    headers,
  }

  const { data } = await axios.get(
    `http://${url}`,
    config
  )

  return data
}
