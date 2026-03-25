import type { PiniaPluginContext } from 'pinia'

export function chromeStorage({ store }: PiniaPluginContext) {
  const storageKey = `pinia-${store.$id}`

  // 标志位：用于区分是“手动修改”还是“存储同步引起的修改”
  let isSyncing = false

  // 1. 初始化：从 chrome.storage 加载持久化数据
  chrome.storage.local.get([storageKey], (result) => {
    if (result[storageKey]) {
      isSyncing = true
      store.$patch(result[storageKey])

      // 使用 queueMicrotask 或 nextTick 确保在 patch 后的微任务阶段重置
      queueMicrotask(() => {
        isSyncing = false
      })
    }
  })

  // 2. 订阅：当 Pinia 状态变化时，同步到 storage
  store.$subscribe((mutation, state) => {
    // 如果是由外部同步引发的修改，则不回写，防止死循环
    if (isSyncing) {
      return
    }

    // 注意：chrome.storage 存储必须是可序列化的 JSON 对象
    chrome.storage.local.set({
      [storageKey]: JSON.parse(JSON.stringify(state)),
    })
  }, {
    detached: true, // 确保组件销毁后，后台页面或其它长存页面依然能同步
  })

  // 3. 监听：其他扩展页面（Popup/Options/Content Scripts）对数据的修改
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes[storageKey]) {
      const { newValue } = changes[storageKey]

      if (newValue) {
        // 只有当新旧数据不一致时才 patch，避免触发不必要的订阅逻辑
        if (JSON.stringify(newValue) !== JSON.stringify(store.$state)) {
          isSyncing = true
          store.$patch(newValue)
          queueMicrotask(() => {
            isSyncing = false
          })
        }
      }
    }
  })
}
