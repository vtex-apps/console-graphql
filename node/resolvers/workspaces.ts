import { Workspaces } from '@vtex/api'
import { map, prop } from 'ramda'

export const workspaces = async (root, args, ctx: Context, info) => {
  const {vtex} = ctx
  const availableWorkspaces : WorkspaceResponse[] = []
  // const availableWorkspaces : WorkspaceResponse[] = [
  //   {
  //     name: 'primeiro',
  //     weight: 1,
  //     production: true,
  //   },
  //   {
  //     name: 'segundo',
  //     weight: 2,
  //     production: true,
  //   }
  // ]
  const workspacesArray = new Workspaces(vtex)
  await workspacesArray.list(vtex.account)
    .then((workspaceArray: WorkspaceResponse[]) =>
      workspaceArray.forEach(workspace => {
        const name = workspace.name
        const weight = workspace.weight
        const production = workspace.production
        availableWorkspaces.push({name, weight, production})
      })
  )
  console.log('availableWorkspaces\n', availableWorkspaces, '\navailableWorkspaces')
  //return availableWorkspaces
  const result = map(prop('name'))(availableWorkspaces)
  console.log('result\n', result, '\nresult')
  return result
}
