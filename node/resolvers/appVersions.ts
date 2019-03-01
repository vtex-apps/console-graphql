import axios from 'axios'
import { map, replace } from 'ramda'

interface VersionData {
  versionIdentifier: string
  location: string
}

interface Args {
  appName: string
}

export const appVersions = async (_, args: Args, ctx: Context) => {
  const { vtex: { account, authToken } } = ctx
  const { appName } = args

  const path = `http://apps.aws-us-east-1.vtex.io/${account}/master/registry/${account}.${appName}`
  const { data: { data : versionsWithAppName } }: any = await axios.get(
    path,
    {
      headers: {
        'Authorization': authToken,
        'Proxy-Authorization': authToken,
      },
    }
  )

  const versions = map(
    (dataPoint: VersionData) => {
      const pattern = `${account}.${appName}@`
      const regex = new RegExp('^' + pattern)
      return replace(regex, '', dataPoint.versionIdentifier)
    }
  , versionsWithAppName)

  return versions
}
