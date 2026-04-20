<script lang="ts" setup>
/**
 * 文件夹扫描设置页面
 */
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      文件夹扫描设置
    </h1>
    <el-form label-width="120px">
      <el-form-item label="扫描路径">
        <el-input
          placeholder="请输入要扫描的文件夹路径"
        />
      </el-form-item>
      <el-form-item label="自动扫描">
        <el-switch />
      </el-form-item>
      <el-form-item label="扫描间隔">
        <el-select placeholder="请选择扫描间隔">
          <el-option label="每小时" value="1h" />
          <el-option label="每天" value="1d" />
          <el-option label="每周" value="1w" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">
          开始扫描
        </el-button>
        <el-button>
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
