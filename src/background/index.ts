/**
 * Background 主入口
 */

import { initContextMenu } from './contextMenu'

/**
 * 初始化右键菜单（包含事件监听）
 */
initContextMenu()

/**
 * 消息监听
 */
chrome.runtime.onMessage.addListener((msg) => {
  // 点击上下文菜单打开选项页
  if (msg.type === 'OPEN_OPTIONS') {
    chrome.runtime.openOptionsPage()
  }
})
