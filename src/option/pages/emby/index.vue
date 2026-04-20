<script lang="ts" setup>
import { AdultConfig } from '@/configs'

/**
 * Emby 设置页面
 */
const embyForm = ref({
  url: AdultConfig.emby.request.url,
  port: AdultConfig.emby.request.port,
  userId: AdultConfig.emby.request.userId,
  token: AdultConfig.emby.request.token,
})

function saveEmbyConfig() {
  window.$notification.success('Emby 配置已保存')
}
</script>

<template>
  <div
    class="p-6"
  >
    <h1
      class="mb-4 text-2xl font-bold"
    >
      Emby 设置
    </h1>

    <el-form
      label-width="120px"
      class="max-w-2xl"
    >
      <el-form-item
        label="服务器地址"
      >
        <el-input
          v-model="embyForm.url"
          placeholder="http://192.168.0.1"
        />
      </el-form-item>

      <el-form-item
        label="端口"
      >
        <el-input
          v-model="embyForm.port"
          placeholder="8096"
        />
      </el-form-item>

      <el-form-item
        label="用户 ID"
      >
        <el-input
          v-model="embyForm.userId"
          placeholder="请输入用户 ID"
        />
      </el-form-item>

      <el-form-item
        label="API Token"
      >
        <el-input
          v-model="embyForm.token"
          placeholder="请输入 API Token"
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="saveEmbyConfig"
        >
          保存配置
        </el-button>

        <el-button
          @click="() => {}"
        >
          测试连接
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
