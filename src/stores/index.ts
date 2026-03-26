import { createPinia } from 'pinia'

import { useEmbyStore } from './modules/emby'

import { useFolderStore } from './modules/folder'

import { useTestStore } from './modules/test'

import { chromeStorage } from './pinia-sync-plugin'

const pinia = createPinia()

pinia.use(
  chromeStorage,
)

export {
  useEmbyStore,
  useFolderStore,
  useTestStore,
}

export default pinia
