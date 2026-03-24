import { createApp } from 'vue'

import { setupPlugins } from '@/plugins'

import Stores from '../stores'

import App from './App.vue'

import '../styles/index'

console.log('[CRXJS] Hello world from content script!')

/**
 * 将 Vue 应用挂载到 DOM。
 */
function mountApp() {
  const container = document.createElement('div')

  container.id = 'crxjs-app'

  document.body.appendChild(container)

  const app = createApp(App)

  setupPlugins(app)

  app.use(Stores)

  app.mount(container)
}

mountApp()
