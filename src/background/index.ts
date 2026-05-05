/**
 * background 入口
 */

// 安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('扩展已安装')
})

// 消息监听
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    // case 'embySearch':
    //   handleEmbySearch(message.data, sendResponse)
    //   return true

    // case 'openEmbyTab':
    //   handleOpenEmbyTab(message.data, sendResponse)
    //   return true
  }
})

// 上下文菜单点击事件
chrome.runtime.onMessage.addListener((msg) => {
  // 点击上下文菜单打开选项页
  if (msg.type === 'OPEN_OPTIONS') {
    chrome.runtime.openOptionsPage()
  }
})
