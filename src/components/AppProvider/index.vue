<!------------------------------------  应用提供者 (提供全局组件)  ------------------------------------------------->
<script setup lang="ts">
import {
  ElMessage,
  ElMessageBox,
  ElNotification,
} from 'element-plus'

import zhCn from 'element-plus/es/locale/lang/zh-cn'

import {
  createTextVNode,
  defineComponent,
  onMounted,
  onUnmounted,
} from 'vue'

/**
 * 组件名称
 */
defineOptions({
  name: 'AppProvider',
})

const isDevelopment = import.meta.env.VITE_APP_ENV === 'development'

/**
 * 上下文持有者组件
 * 用于注册全局消息组件
 */
const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    /**
     * 注册全局消息组件
     */
    function registerGlobalComponents() {
      try {
        window.$notification = ElNotification

        window.$messageBox = ElMessageBox

        window.$message = ElMessage

        window.$isDevelopment = isDevelopment

        console.log('[AppProvider] 全局组件注册成功', {
          $notification: typeof window.$notification,
          $message: typeof window.$message,
          $messageBox: typeof window.$messageBox,
        })
      }
      catch (error) {
        console.error('[AppProvider] 注册全局组件失败', error)
      }
    }

    onMounted(() => {
      registerGlobalComponents()
    })

    onUnmounted(() => {
    })

    return () => createTextVNode()
  },
})
</script>

<template>

  <ElConfigProvider
    :locale="zhCn"
  >
    <ContextHolder />

    <slot />

  </ElConfigProvider>
</template>

<style scoped></style>
