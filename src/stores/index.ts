import { createPinia } from 'pinia'

import { piniaChromeStoragePlugin } from 'pinia-chrome-storage'

import useTestStore from './modules/test'

const pinia = createPinia()

export {
  useTestStore,
}

pinia.use(piniaChromeStoragePlugin)

export default pinia
