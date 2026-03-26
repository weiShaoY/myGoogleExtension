import { createPinia } from 'pinia'

import { useFolderStore } from './modules/folder'

import { useTestStore } from './modules/test'

import { chromeStorage } from './pinia-sync-plugin'

const pinia = createPinia()

pinia.use(
  chromeStorage,
)

export {

  useFolderStore,
  useTestStore,
}

export default pinia
