import type { ExtensionContext } from 'vscode'
import { Range, commands, window, workspace } from 'vscode'

import { Command } from './command'
import { replace } from './replace'
import { StatusBarItem } from './StatusBarItem'

export function activate(content: ExtensionContext) {
  const barItem = new StatusBarItem()
  workspace.onDidChangeTextDocument((event) => {
    const { reason } = event
    if (reason)
      return

    if (!barItem.status)
      return

    const editor = window.activeTextEditor

    if (!editor)
      return

    const { document, selection } = editor
    const curPosition = selection.active

    const p1 = curPosition.translate(0, -1)
    const p2 = curPosition.translate(0, 1)

    const inputWord = document.getText(new Range(p1, p2))

    const [c1, c2] = inputWord.split('')

    const result = replace(c1, c2)

    if (result) {
      editor.edit((editBuilder) => {
        editBuilder.replace(new Range(curPosition, p2), result)
      }).then(() => {
        if (result === '.')
          commands.executeCommand('editor.action.triggerSuggest')
      })
    }
  })

  content.subscriptions.push(
    commands.registerCommand(Command.StartWatching, () => {
      window.showInformationMessage('The auto-mark is able to use!')
      barItem.toAble()
    }),
    commands.registerCommand(Command.StopWatching, () => {
      window.showInformationMessage('The auto-mark is disable to use!')
      barItem.toDisable()
    }),
  )
}

export function deactivate() {}
