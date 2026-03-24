import { createPinia } from 'pinia'

import { createPersistedState } from 'pinia-plugin-persistedstate'

// import useEmbyStore from './modules/emby'

// import useFolderStore from './modules/folder'

// import useTorrentStore from './modules/torrent'

export {

  // useEmbyStore,
  // useFolderStore,
  // useTorrentStore,
}

const pinia = createPinia()

const persistPlugin = createPersistedState()

pinia.use(persistPlugin)

export default pinia
