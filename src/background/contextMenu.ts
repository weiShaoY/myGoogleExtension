import { AdultConfig } from '@/configs'

/**
 * 菜单常量
 */
export const MENU_ID = {
  ROOT: 'adult-root',
  OPTION: 'adult-option',
} as const

/**
 * 格式化搜索关键字
 * @param text - 原始选中文本
 */
export function formatSearchQuery(text: string): string {
  if (!text) {
    return ''
  }

  return text
    .normalize()
    .replace(/\s+/g, '')
    .replace(/_/g, '-')
    .toUpperCase()
    .trim()
}

/**
 * 在新标签页打开 URL
 */
export function openNewTab(url: string) {
  chrome.tabs.create({
    url,
  })
}

/**
 * 根据站点 ID 获取站点配置
 */
export function getSiteConfig(id: string) {
  return AdultConfig.siteList.find(site => site.hostname === id)
}

/**
 * 处理搜索请求
 */
export function handleSearch(siteId: string, query: string) {
  const site = getSiteConfig(siteId)

  if (!site) {
    console.warn(`[ContextMenu] Unknown site: ${siteId}`)
    return
  }

  if (!site.transformQuery) {
    console.warn(`[ContextMenu] Site ${siteId} has no transformQuery function`)
    return
  }

  const url = site.transformQuery(query)

  openNewTab(url)
}

/**
 * 初始化右键菜单并设置事件监听
 */
export function initContextMenu() {
  // 初始化菜单结构
  chrome.contextMenus.removeAll(() => {
    // 创建根菜单
    chrome.contextMenus.create({
      id: MENU_ID.ROOT,
      title: '成人',
      contexts: ['selection'],
    })

    // 创建搜索站点子菜单（只显示可见的站点）
    AdultConfig.siteList
      .filter(site => site.isVisible)
      .forEach((site) => {
        chrome.contextMenus.create({
          id: site.hostname,
          title: site.name,
          parentId: MENU_ID.ROOT,
          contexts: ['selection'],
        })
      })

    // 创建选项页菜单
    chrome.contextMenus.create({
      id: MENU_ID.OPTION,
      title: '选项页',
      parentId: MENU_ID.ROOT,
      contexts: ['all'],
    })
  })

  // 设置点击事件监听
  chrome.contextMenus.onClicked.addListener((info, _tab) => {
    const menuId = info.menuItemId as string

    const rawText = info.selectionText || ''

    // 格式化搜索关键字
    const query = formatSearchQuery(rawText)

    // 选项页
    if (menuId === MENU_ID.OPTION) {
      chrome.runtime.openOptionsPage()
      return
    }

    // 搜索功能
    if (!query) {
      return
    }

    handleSearch(menuId, query)
  })
}
