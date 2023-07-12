import * as vscode from 'vscode'

import type { WorkspaceConfiguration, WorkspaceFolder } from 'vscode'

// import { isDefinitelyVitestEnv, mayBeVitestEnv } from './pure/isVitestEnv'
// import { getVitestCommand, getVitestVersion, isNodeAvailable } from './pure/utils'
// import { log } from './log'

export const extensionId = 'zxch3n.vitest-explorer'

export function getConfigValue<T>(
  rootConfig: WorkspaceConfiguration,
  folderConfig: WorkspaceConfiguration,
  key: string,
  defaultValue: T,
): T {
  return folderConfig.get(key) ?? rootConfig.get(key) ?? defaultValue
}

export function getConfig(workspaceFolder?: WorkspaceFolder | vscode.Uri | string) {
  let workspace: WorkspaceFolder | vscode.Uri | undefined
  if (typeof workspaceFolder === 'string')
    workspace = vscode.Uri.from({ scheme: 'file', path: workspaceFolder })
  else
    workspace = workspaceFolder

  const folderConfig = vscode.workspace.getConfiguration('vitest', workspace)
  const rootConfig = vscode.workspace.getConfiguration('vitest')

  const get = <T>(key: string, defaultValue: T) => getConfigValue<T>(rootConfig, folderConfig, key, defaultValue)

  return {
    env: get<null | Record<string, string>>('nodeEnv', null),
    commandLine: get<string | undefined>('commandLine', undefined),
    include: get<string[]>('include', []),
    exclude: get<string[]>('exclude', []),
    enable: get<boolean>('enable', false),
    debugExclude: get<string[]>('debugExclude', []),
  }
}

export function getRootConfig() {
  const rootConfig = vscode.workspace.getConfiguration('vitest')

  return {
    showFailMessages: rootConfig.get('showFailMessages', false),
    changeBackgroundColor: rootConfig.get('changeBackgroundColor', true),
    disabledWorkspaceFolders: rootConfig.get<string[]>('disabledWorkspaceFolders', []),
  }
}

export const vitestEnvironmentFolders: ReadonlyArray<WorkspaceFolder> = []

export interface VitestWorkspaceConfig {
  workspace: vscode.WorkspaceFolder
  isUsingVitestForSure: boolean
  cmd: string
  args: string[]
  version?: string
  isCompatible: boolean
  isDisabled: boolean
}

/**
 * @returns vitest workspaces filtered by `disabledWorkspaceFolders`
 */
export function getValidWorkspaces(workspaces: vscode.WorkspaceFolder[]): vscode.WorkspaceFolder[] {
  const { disabledWorkspaceFolders } = getRootConfig()
  return workspaces.filter(workspace => !disabledWorkspaceFolders.includes(workspace.name)) || []
}
