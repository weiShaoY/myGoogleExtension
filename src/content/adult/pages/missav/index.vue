<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import DetailsPage from './missavDetailsPage.vue'

import ListPage from './missavListPage.vue'

const loadingCompleted = ref(false)

const isListPage = ref(false) // 这里是响应式变量

onMounted(() => {
  delayRun(() => {
    // ✅ 正确：不要重新 const，直接赋值
    isListPage.value = !$('#sprite-plyr')

    console.log('🚀 ~ 页面判断:', isListPage.value)

    const bodyClass = isListPage.value ? 'missav-list-page' : 'missav-details-page'

    document.body.classList.add('missav', bodyClass)

    loadingCompleted.value = true
  })
})
</script>

<template>
  <template>
    <ListPage
      v-if="isListPage"
    />

    <DetailsPage
      v-else
    />
  </template>
</template>

<style lang="scss">
@use './index.scss';
</style>
