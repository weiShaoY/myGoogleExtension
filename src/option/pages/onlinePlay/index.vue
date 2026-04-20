<script lang="ts" setup>
import { onlinePlayConfig } from '@/configs'

/**
 * 在线播放设置页面
 */
const onlinePlayForm = ref({
  enabled: true,
  siteCount: onlinePlayConfig.siteList.length,
})

function saveOnlinePlayConfig() {
  window.$notification.success('在线播放配置已保存')
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      在线播放设置
    </h1>
    <el-form
      label-width="120px"
      class="max-w-2xl"
    >
      <el-form-item label="启用在线播放">
        <el-switch v-model="onlinePlayForm.enabled" />
      </el-form-item>
      <el-form-item label="站点数量">
        <span>{{ onlinePlayForm.siteCount }} 个站点</span>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="saveOnlinePlayConfig"
        >
          保存配置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
