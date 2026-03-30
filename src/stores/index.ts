import { createPinia } from 'pinia'

import { useAdultStore } from './modules/adult'

import { useTestStore } from './modules/test'

import { chromeStorage } from './pinia-sync-plugin'

const pinia = createPinia()

pinia.use(
  chromeStorage,
)

export {
  useAdultStore,
  useTestStore,
}

export default pinia
