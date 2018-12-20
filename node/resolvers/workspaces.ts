import { Workspaces } from '@vtex/api'

export const workspaces = async (root, args, ctx: Context, info) => {
  const {vtex} = ctx
  const availableWorkspaces : WorkspaceResponse[] = []
  const workspacesArray = new Workspaces(vtex, {})
  await workspacesArray.list(vtex.account)
    .then((workspaceArray: WorkspaceResponse[]) =>
      workspaceArray.forEach(workspace => {
        const name = workspace.name
        const weight = workspace.weight
        const production = workspace.production
        availableWorkspaces.push({name, weight, production})
      })
  )
  return availableWorkspaces
}