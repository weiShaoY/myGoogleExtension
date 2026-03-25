import { createPinia } from 'pinia'

import useTestStore from './modules/test'

import { chromeStorage } from './pinia-sync-plugin'

const pinia = createPinia()

pinia.use(
  chromeStorage,
)

export {
  useTestStore,
}

export default pinia
