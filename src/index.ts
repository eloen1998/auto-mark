import type { ExtensionContext } from 'vscode'
import { Range, commands, window, workspace } from 'vscode'

import { Command } from './command'
import { replaceMap } from './replace'
import { StatusBarItem } from './StatusBarItem'

export function activate(content: ExtensionContext) {
  const barItem = new StatusBarItem()
  workspace.onDidChangeTextDocument((event) => {
    const { reason } = event
    if (reason) {
      // 撤销、回退、粘贴的内容不会处理
      return
    }

    if (!barItem.status) {
      // 禁用状态不会处理
      return
    }

    const editor = window.activeTextEditor
    if (!editor) {
      return
    }

    const { document, selection } = editor
    const curPosition = selection.active
    const lineText = document.lineAt(curPosition.line).text

    const curChart = lineText[curPosition.character]
    const replaceChart = replaceMap[curChart]
    // 不需要替换的不处理
    if (!replaceChart) {
      return
    }

    const textBeforeCursor = lineText.substring(0, curPosition.character)
    // 前面没有内容不处理
    if (!textBeforeCursor) {
      return
    }

    const isInString = /\B("|')[^"']*$/g.test(textBeforeCursor)
    // 在双引号、单引号之间的不处理
    if (isInString) {
      return
    }

    // 前面是中文或者中文符号，不处理
    const isChinese = /[\u4e00-\u9fa5]/.test(textBeforeCursor.at(-1)!)
    if (isChinese) {
      return
    }
    

    editor.edit((editBuilder) => {
      editBuilder.replace(new Range(curPosition, curPosition.translate(0, 1)), replaceChart)
    }).then(() => {
      if (replaceChart === '.')
        commands.executeCommand('editor.action.triggerSuggest')
    })
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

export function deactivate() { }
