<script lang="ts" setup>
// 1. 手动导入 Element Plus 组件（解决核心报错：组件未正确加载）
import {
  ElLink,
  ElTable,
  ElTableColumn,
} from 'element-plus'

// 2. 定义类型 + 极简数据
type ScriptItem = {
  name: string
  url: string
  description: string
}

// 常量数据（无响应式风险，最稳定）
const tableData: ScriptItem[] = [
  {
    name: 'JavBus/Javdb/library/javbooks/avmoo/avsox/sehuatang/msin图书馆预告片花Direct',
    url: 'https://greasyfork.org/zh-CN/scripts/441120-javbus-javdb-library-trailer',
    description: '视频预览',
  },

  {
    name: '根据番号快速搜索',
    url: 'https://greasyfork.org/zh-CN/scripts/423350-%E6%A0%B9%E6%8D%AE%E7%95%AA%E5%8F%B7%E5%BF%AB%E9%80%9F%E6%90%9C%E7%B4%A2',
    description: '标记网页上的所有番号, 在相关网站快速方便的进行搜索',
  },
  {
    name: 'OneJAVOneWeb list自用版',
    url: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list',
    description: '一个插件畅览N个JAV网站，涵盖车牌信息、演员信息、磁力种子、片花、在线观看、资讯、大缩略图等',
  },

  {
    name: 'myOneJAVOneWeb',
    url: 'https://greasyfork.org/zh-CN/scripts/494871-myonejavoneweb',
    description: '修改自  OneJAVOneWeb list自用版',
  },

  {
    name: 'Enhanced word highlight',
    url: 'https://greasyfork.org/zh-CN/scripts/7251-enhanced-word-highlight',
    description: '在搜索引擎和任意网页获得增强的高亮！',
  },

  {
    name: 'MissAV 增强小助手',
    url: 'https://greasyfork.org/zh-CN/scripts/529125-missav-enhanced-assistant',
    description: '去除广告|后台播放|自动播放|自定义快进时间|完整标题|更多功能...',
  },
  {
    name: 'JAV-JHS',
    url: 'https://greasyfork.org/zh-CN/scripts/558525-jav-jhs/post-install',
    description: 'Jav-鉴黄师 收藏、屏蔽、标记已下载; 屏蔽标签、屏蔽演员、同步收藏演员、新作品检测; 免VIP查看热播、Top250排行榜、Fc2ppv、可查看所有评论信息、相关清单; 支持云盘备份; 以图识图; 字幕搜索; JavDb|JavBus',
  },
  {
    name: '',
    url: '',
    description: '',
  },
  {
    name: '',
    url: '',
    description: '',
  },
  {
    name: '',
    url: '',
    description: '',
  },
]
</script>

<template>
  <!-- 极简表格：删除所有可能导致渲染崩溃的属性 -->
  <ElTable
    :data="tableData"
    border
    :style="{
      width: '100%',
      height: '100%',
    }"
  >
    <!-- 基础列 -->
    <ElTableColumn
      prop="name"
      label="脚本名称"
      width="500"
    />
    <!-- 链接列（最简写法，无任何冗余） -->
    <ElTableColumn
      prop="url"
      label="脚本地址"
      width="160"
    >
      <template
        #default="scope"
      >
        <ElLink
          :href="scope.row.url"
          target="_blank"
          type="primary"
        >
          前往安装
        </ElLink>
      </template>
    </ElTableColumn>

    <ElTableColumn
      prop="description"
      label="脚本功能"
    />

  </ElTable>
</template>

<style lang="scss" scoped>
/* 清空所有样式，无样式冲突 */
</style>
