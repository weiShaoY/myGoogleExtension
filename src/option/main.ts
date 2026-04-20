import { createApp } from 'vue'

import { setDirectives } from '@/directives'

import { setupPlugins } from '@/plugins'

import Pinia from '../stores'

import App from './App.vue'

import { setupRouter } from './router'

import '../styles/index'

/**
 * 将 Vue 应用挂载到 DOM。
 */
async function mountApp() {
  const app = createApp(App)

  app.use(Pinia)

  await setupRouter(app)

  setupPlugins(app)

  setDirectives(app)

  app.mount('#app')
}

mountApp()
