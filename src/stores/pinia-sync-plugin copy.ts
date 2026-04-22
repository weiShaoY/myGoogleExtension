// import type { PiniaPluginContext } from 'pinia'

// export function chromeStorage({ store }: PiniaPluginContext) {
//   const storageKey = `pinia-${store.$id}`

//   // 标志位：用于区分是“手动修改”还是“存储同步引起的修改”
//   let isSyncing = false

//   // 标志位：用于忽略自身写入 storage 导致的 onChanged 回调（大数据量时会非常卡）
//   let isWriting = false

//   // 2. 同步到 storage 的任务合并（大对象 JSON 序列化很重，避免频繁触发）
//   let pendingState: any | null = null

//   let persistHandle: ReturnType<typeof setTimeout> | number | null = null

//   let persistHandleType: 'idle' | 'timeout' | null = null

//   const requestIdleCallbackFn = (globalThis as any).requestIdleCallback as
//     | ((cb: () => void, opts?: { timeout?: number }) => number)
//     | undefined

//   const cancelIdleCallbackFn = (globalThis as any).cancelIdleCallback as
//     | ((handle: number) => void)
//     | undefined

//   // 1. 初始化：从 chrome.storage 加载持久化数据
//   chrome.storage.local.get([storageKey], (result) => {
//     if (result[storageKey]) {
//       isSyncing = true
//       store.$patch(result[storageKey])

//       // 使用 queueMicrotask 或 nextTick 确保在 patch 后的微任务阶段重置
//       queueMicrotask(() => {
//         isSyncing = false
//       })
//     }
//   })

//   function clearScheduledPersist() {
//     if (persistHandle == null) {
//       return
//     }

//     if (persistHandleType === 'idle' && cancelIdleCallbackFn) {
//       cancelIdleCallbackFn(persistHandle as number)
//     }
//     else if (persistHandleType === 'timeout') {
//       clearTimeout(persistHandle as ReturnType<typeof setTimeout>)
//     }

//     persistHandle = null
//     persistHandleType = null
//   }

//   function flushPersist() {
//     clearScheduledPersist()

//     if (!pendingState) {
//       return
//     }

//     const stateSnapshot = pendingState

//     pendingState = null

//     let payload: any

//     try {
//       // 注意：chrome.storage 存储必须是可序列化的 JSON 对象
//       payload = JSON.parse(JSON.stringify(stateSnapshot))
//     }
//     catch (e) {
//       console.warn(`[pinia-sync] serialize failed: ${store.$id}`, e)
//       return
//     }

//     isWriting = true

//     chrome.storage.local.set({
//       [storageKey]: payload,
//     }, () => {
//       const err = chrome.runtime?.lastError

//       if (err) {
//         console.warn(`[pinia-sync] storage.set failed: ${store.$id}`, err)
//       }

//       // 保持至少一个 macrotask，让 onChanged（自身写入）能被 isWriting 拦截
//       setTimeout(() => {
//         isWriting = false
//       }, 0)
//     })
//   }

//   function schedulePersist(state: any) {
//     pendingState = state

//     // 已有计划任务：等它 flush（拿的是最新的 pendingState）
//     if (persistHandle != null) {
//       return
//     }

//     if (requestIdleCallbackFn) {
//       persistHandleType = 'idle'
//       persistHandle = requestIdleCallbackFn(flushPersist, {
//         timeout: 1200,
//       })
//     }
//     else {
//       persistHandleType = 'timeout'
//       persistHandle = setTimeout(flushPersist, 0)
//     }
//   }

//   // 2. 订阅：当 Pinia 状态变化时，同步到 storage
//   store.$subscribe((mutation, state) => {
//     // 如果是由外部同步引发的修改，则不回写，防止死循环
//     if (isSyncing) {
//       return
//     }

//     schedulePersist(state)
//   }, {
//     detached: true, // 确保组件销毁后，后台页面或其它长存页面依然能同步
//   })

//   // 3. 监听：其他扩展页面（Popup/Options/Content Scripts）对数据的修改
//   chrome.storage.onChanged.addListener((changes, areaName) => {
//     if (areaName === 'local' && changes[storageKey]) {
//       const { newValue } = changes[storageKey]

//       if (newValue) {
//         // 忽略自身写入导致的变更，避免大数据量 JSON.stringify 对比卡死主线程
//         if (isWriting) {
//           return
//         }

//         isSyncing = true
//         store.$patch(newValue)
//         queueMicrotask(() => {
//           isSyncing = false
//         })
//       }
//     }
//   })
// }
