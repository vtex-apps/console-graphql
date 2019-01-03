import { HttpClient } from '@vtex/api'
import { ColossusContext } from 'colossus'
import * as R from 'ramda'

interface FetchOptions {
  authToken: string,
  cookie?: string,
  production: boolean
}

interface PairCharNumber {
  char: string,
  i: number
}

const getNthOcurrence = (str: string, char: string, n: number): number => {
  const stringSplitWithIndex = str.split('').map((letter, i) => {
    return {char: letter, i}
  })

  const dashPositions = R.filter((el: PairCharNumber) => el.char === char, stringSplitWithIndex)
  return dashPositions[n-1].i
}


export default class Fetcher {

  private headers: any
  private production: boolean

  constructor(ctx: any) {
    const { vtex: ioContext} = ctx
    const { authToken, production } = ioContext
    const cookie = ctx.get('cookie')

    const options = {
      authToken,
      cookie,
      production,
    } as FetchOptions

    this.headers = {
      ... options.cookie ? { Cookie: options.cookie } : null,
      ... options.authToken ? { 'Proxy-Authorization': options.authToken } : null,
    }
    this.production = options.production
  }

  public async get(url: string) {

    const baseURL = url.substr(0, getNthOcurrence(url, '/', 3))
    const path = url.substr(baseURL.length)


    const userAgent = process.env.VTEX_APP_ID
    const client = new HttpClient({
      baseURL,
      userAgent,
    })

    try {
      const response = await client.get(path, {headers: this.headers, production: this.production})
      return response
    } catch(e) {
      console.log(e)
    }
  }
}
