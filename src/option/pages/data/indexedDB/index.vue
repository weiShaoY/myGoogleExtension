<script lang="ts" setup>

// 2. 定义类型 + 极简数据
type ScriptItem = {
  name: string
  githubUrl?: string
  description: string
}

// 常量数据（无响应式风险，最稳定）
const tableData: ScriptItem[] = [

  {
    name: 'Dexie.js',
    githubUrl: 'https://github.com/dexie/Dexie.js',
    description: 'Dexie.js 是 indexedDB (浏览器中的标准数据库)的封装库。https : //dexie.org',
  },
  {
    name: 'idb',
    githubUrl: 'https://github.com/jakearchibald/idb',
    description: '这是一个非常小的（约 1.19kB,使用 Brotli 压缩后）库，它主要模仿 IndexedDB API,但进行了一些小的改进，从而大大提高了可用性。',
  },
  {
    name: '',
    githubUrl: '',
    description: '',
  },
]
</script>

<template>
  <div
    class="box-border h-full flex items-center justify-center p-20"
  >
    <!-- 极简表格：删除所有可能导致渲染崩溃的属性 -->
    <el-table
      :data="tableData"
      class="h-full w-full"
      size="large"
      stripe
    >
      <!-- 基础列 -->
      <el-table-column
        prop="name"
        label="脚本名称"
        width="500"
      />
      <!-- githubUrl -->
      <el-table-column
        prop="githubUrl"
        label="仓库地址"
        width="160"
      >
        <template
          #default="scope"
        >
          <el-link
            v-if="scope.row.githubUrl"
            :href="scope.row.githubUrl"
            target="_blank"
            type="primary"
          >
            前往仓库
          </el-link>
        </template>
      </el-table-column>

      <el-table-column
        prop="description"
        label="脚本功能"
      />

    </el-table>
  </div>
</template>

<style lang="scss" scoped>
/* 清空所有样式，无样式冲突 */
</style>
