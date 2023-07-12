import * as vscode from 'vscode'
import { Command } from './command'

export class StatusBarItem extends vscode.Disposable {
  public item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    5,
  )

  public status = true

  constructor() {
    super(() => {
      this.item.dispose()
    })

    this.toAble()
  }

  hide() {
    this.item.hide()
  }

  toAble() {
    this.status = true
    this.item.command = Command.StopWatching
    this.item.text = '$(lightbulb-autofix)'
    this.item.tooltip = 'Deactivate auto mark'
    this.setBackgroundColor(false)
    this.item.show()
  }

  toDisable() {
    this.status = false

    this.item.command = Command.StartWatching
    this.item.text = '$(lightbulb)'
    this.item.tooltip = 'Activate auto mark'
    this.setBackgroundColor(true)
    this.item.show()
  }

  setBackgroundColor(offline: boolean) {
    this.item.backgroundColor = offline ? new vscode.ThemeColor('statusBarItem.warningBackground') : undefined
  }
}
