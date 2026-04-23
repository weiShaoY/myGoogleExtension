/**
 * background 入口
 */

// 导入 emby 模块
import {
  handleEmbySearch,
  handleOpenEmbyTab,
} from './emby'

// 安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('扩展已安装')
})

// 消息监听
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'embySearch':
      handleEmbySearch(message.data, sendResponse)
      return true

    case 'openEmbyTab':
      handleOpenEmbyTab(message.data, sendResponse)
      return true
  }
})

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'OPEN_OPTIONS') {
    chrome.runtime.openOptionsPage()
  }
})
