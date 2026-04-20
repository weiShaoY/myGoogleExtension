import { createApp } from 'vue'

import { setDirectives } from '@/directives'

import { setupPlugins } from '@/plugins'

import Pinia from '../stores'

import App from './App.vue'

import router from './router'

import '../styles/index'

/**
 * 将 Vue 应用挂载到 DOM。
 */
function mountApp() {
  const app = createApp(App)

  app.use(Pinia)

  app.use(router)

  setupPlugins(app)

  setDirectives(app)

  app.mount('#app')
}

mountApp()
