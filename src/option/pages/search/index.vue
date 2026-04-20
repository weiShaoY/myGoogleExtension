<script lang="ts" setup>
import { SearchConfig } from '@/configs'

/**
 * 搜索设置页面
 */
const searchForm = ref({
  displayOnPaths: SearchConfig.displayOnPaths,
  siteGroups: SearchConfig.siteGroups,
})

function saveSearchConfig() {
  window.$notification.success('搜索配置已保存')
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      搜索设置
    </h1>
    <el-form
      label-width="120px"
      class="max-w-2xl"
    >
      <el-form-item label="启用搜索">
        <el-switch />
      </el-form-item>
      <el-form-item label="显示路径">
        <el-input
          v-model="searchForm.displayOnPaths[0]"
          placeholder="请输入显示路径"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="saveSearchConfig"
        >
          保存配置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
