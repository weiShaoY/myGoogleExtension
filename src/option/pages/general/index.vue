<script lang="ts" setup>
/**
 * 通用设置页面
 */
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      通用设置
    </h1>
    <el-form label-width="120px">
      <el-form-item label="主题">
        <el-select placeholder="请选择主题">
          <el-option label="浅色" value="light" />
          <el-option label="深色" value="dark" />
          <el-option label="跟随系统" value="auto" />
        </el-select>
      </el-form-item>
      <el-form-item label="语言">
        <el-select placeholder="请选择语言">
          <el-option label="简体中文" value="zh-CN" />
          <el-option label="English" value="en-US" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
