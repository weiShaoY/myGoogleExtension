/**
 * 菜单ID
 */
const MENU_ID = {
  ROOT: 'adult-root',
  JAVDB: 'adult-javDB',
  JAVBUS: 'adult-javBus',
  MISSAV: 'adult-missAV',
  EMBY: 'adult-emby',
  OPTION: 'adult-option',
} as const

/**
 * 子菜单
 */
const SUB_MENUS = [
  {
    id: MENU_ID.JAVDB,
    title: 'JavDB',
  },
  {
    id: MENU_ID.JAVBUS,
    title: 'JavBus',
  },
  {
    id: MENU_ID.MISSAV,
    title: 'MissAV',
  },
  {
    id: MENU_ID.EMBY,
    title: 'Emby',
  },
]

/**
 * 初始化菜单
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID.ROOT,
      title: '成人',
      contexts: ['all'],
    })

    SUB_MENUS.forEach((item) => {
      chrome.contextMenus.create({
        ...item,
        parentId: MENU_ID.ROOT,
        contexts: ['all'],
      })
    })

    chrome.contextMenus.create({
      id: MENU_ID.OPTION,
      title: '选项页',
      parentId: MENU_ID.ROOT,
      contexts: ['all'],
    })
  })
})

/**
 * 格式化番号
 * @param text
 */
function formatText(text?: string) {
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
 * 打开标签页
 * @param url
 */
function openTab(url: string) {
  chrome.tabs.create({
    url,
  })
}

/**
 * 功能
 */
function openJavDB(code: string) {
  openTab(`https://javdb.com/search?q=${encodeURIComponent(code)}`)
}

function openJavBus(code: string) {
  openTab(`https://www.javbus.com/${encodeURIComponent(code)}`)
}

function openMissAV(code: string) {
  openTab(`https://missav.com/search/${encodeURIComponent(code)}`)
}

function handleEmby(code: string) {
  openTab(`https://app.emby.media/search.html?query=${encodeURIComponent(code)}`)
}

/**
 * 行为映射
 */
const actionMap: Record<string, (text: string, tab?: chrome.tabs.Tab) => void> = {
  [MENU_ID.JAVDB]: openJavDB,
  [MENU_ID.JAVBUS]: openJavBus,
  [MENU_ID.MISSAV]: openMissAV,
  [MENU_ID.EMBY]: handleEmby,
  [MENU_ID.OPTION]: () => chrome.runtime.openOptionsPage(),
}

/**
 * 右键点击
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const raw = info.selectionText || ''

  const text = formatText(raw)

  console.log('选中文本:', raw)
  console.log('处理后:', text)

  if (!text && info.menuItemId !== MENU_ID.OPTION) {
    return
  }

  const handler = actionMap[info.menuItemId]

  handler?.(text, tab)
})
