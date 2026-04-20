<script lang="ts" setup>
/**
 * 高级设置页面
 */
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      高级设置
    </h1>
    <el-form
      label-width="120px"
      class="max-w-2xl"
    >
      <el-form-item label="开发者模式">
        <el-switch />
      </el-form-item>
      <el-form-item label="调试日志">
        <el-switch />
      </el-form-item>
      <el-form-item label="网络代理">
        <el-input placeholder="请输入代理地址" />
      </el-form-item>
      <el-form-item label="请求超时">
        <el-input-number
          :min="1000"
          :max="60000"
          :step="1000"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">
          保存配置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
