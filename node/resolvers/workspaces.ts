import { Workspaces } from '@vtex/api'


export const workspaces = async (root, args, ctx: Context, info) => {
  const {vtex} = ctx
  const availableWorkspaces : string[] = []
  const workspacesArray = new Workspaces(vtex)
  await workspacesArray.list(vtex.account)
    .then((workspaceArray: WorkspaceResponse[]) =>
      workspaceArray.forEach(workspace => {
        availableWorkspaces.push(workspace.name)
      })
  )
  return availableWorkspaces
}
