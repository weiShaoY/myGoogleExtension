import { AdultConfig } from '@/configs'

/**
 * 搜索站点配置
 */
export type SearchEngine = {
  id: string
  title: string
  baseUrl: string
  queryParam: string
  transformQuery?: (query: string) => string
}

/**
 * 菜单常量
 */
export const MENU_ID = {
  ROOT: 'adult-root',
  OPTION: 'adult-option',
} as const

/**
 * 搜索站点列表
 */
export const SEARCH_ENGINES: SearchEngine[] = [
  {
    id: 'adult-javDB',
    title: 'JavDB',
    baseUrl: 'https://javdb.com/search',
    queryParam: 'q',
  },
  {
    id: 'adult-javBus',
    title: 'JavBus',
    baseUrl: 'https://www.javbus.com',
    queryParam: '',
    transformQuery: query => `/${query}`,
  },
  {
    id: 'adult-missAV',
    title: 'MissAV',
    baseUrl: 'https://missav.com/search',
    queryParam: '',
    transformQuery: query => `/${query}`,
  },

]

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
 * 生成搜索 URL
 */
export function buildSearchUrl(engine: SearchEngine, query: string): string {
  const encodedQuery = encodeURIComponent(query)

  if (engine.transformQuery) {
    return `${engine.baseUrl}${engine.transformQuery(encodedQuery)}`
  }

  return `${engine.baseUrl}?${engine.queryParam}=${encodedQuery}`
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
 * 根据引擎 ID 获取搜索引擎配置
 */
export function getSearchEngine(id: string): SearchEngine | undefined {
  return SEARCH_ENGINES.find(engine => engine.id === id)
}

/**
 * 处理搜索请求
 */
export function handleSearch(engineId: string, query: string) {
  const engine = getSearchEngine(engineId)

  if (!engine) {
    console.warn(`[ContextMenu] Unknown search engine: ${engineId}`)
    return
  }

  const url = buildSearchUrl(engine, query)

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

    // 创建搜索站点子菜单
    AdultConfig.siteList.forEach((engine) => {
      chrome.contextMenus.create({
        id: engine.hostname,
        title: engine.name,
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
