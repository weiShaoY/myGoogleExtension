import { createApp } from 'vue'

import { setDirectives } from '@/directives'

import { setupPlugins } from '@/plugins'

import Pinia from '../stores'

import App from './App.vue'

import '../styles/index'

/**
 * 将 Vue 应用挂载到 DOM。
 */
function mountApp() {
  const container = document.createElement('div')

  container.id = 'crxjs-app'

  document.body.appendChild(container)

  const app = createApp(App)

  app.use(Pinia)

  setupPlugins(app)

  setDirectives(app)

  app.mount(container)
}

mountApp()
