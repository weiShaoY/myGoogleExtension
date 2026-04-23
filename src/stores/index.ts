import { createPinia } from 'pinia'

import { useAdultStore } from './modules/adult'

import { useSiteStore } from './modules/site'

import { useTestStore } from './modules/test'

import { chromeStorage } from './pinia-sync-plugin'

const pinia = createPinia()

pinia.use(
  chromeStorage,
)

export {
  useAdultStore,
  useSiteStore,
  useTestStore,
}

export default pinia
