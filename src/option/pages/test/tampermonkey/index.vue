<script lang="ts" setup>

// 2. 定义类型 + 极简数据
type ScriptItem = {
  name: string
  tampermonkeyUrl: string
  githubUrl?: string
  description: string
}

// 常量数据（无响应式风险，最稳定）
const tableData: ScriptItem[] = [
  {
    name: 'JavBus/Javdb/library/javbooks/avmoo/avsox/sehuatang/msin图书馆预告片花Direct',
    tampermonkeyUrl: 'https://greasyfork.org/zh-CN/scripts/441120-javbus-javdb-library-trailer',
    description: '视频预览',
  },

  {
    name: '根据番号快速搜索',
    tampermonkeyUrl: 'https://greasyfork.org/zh-CN/scripts/423350-%E6%A0%B9%E6%8D%AE%E7%95%AA%E5%8F%B7%E5%BF%AB%E9%80%9F%E6%90%9C%E7%B4%A2',
    description: '标记网页上的所有番号, 在相关网站快速方便的进行搜索',
  },
  {
    name: 'OneJAVOneWeb list自用版',
    tampermonkeyUrl: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list',
    description: '一个插件畅览N个JAV网站，涵盖车牌信息、演员信息、磁力种子、片花、在线观看、资讯、大缩略图等',
  },

  {
    name: 'myOneJAVOneWeb',
    tampermonkeyUrl: 'https://greasyfork.org/zh-CN/scripts/494871-myonejavoneweb',
    description: '修改自  OneJAVOneWeb list自用版',
  },

  {
    name: 'Enhanced word highlight',
    tampermonkeyUrl: 'https://greasyfork.org/zh-CN/scripts/7251-enhanced-word-highlight',
    description: '在搜索引擎和任意网页获得增强的高亮！',
  },

  {
    name: 'MissAV 增强小助手',
    tampermonkeyUrl: 'https://greasyfork.org/zh-CN/scripts/529125-missav-enhanced-assistant',
    description: '去除广告|后台播放|自动播放|自定义快进时间|完整标题|更多功能...',
  },
  {
    name: 'JAV-JHS',
    tampermonkeyUrl: 'https://greasyfork.org/zh-CN/scripts/558525-jav-jhs/post-install',
    description: 'Jav-鉴黄师 收藏、屏蔽、标记已下载; 屏蔽标签、屏蔽演员、同步收藏演员、新作品检测; 免VIP查看热播、Top250排行榜、Fc2ppv、可查看所有评论信息、相关清单; 支持云盘备份; 以图识图; 字幕搜索; JavDb|JavBus',
  },
  {
    name: 'JavDB影片管理器',
    tampermonkeyUrl: 'https://sleazyfork.org/zh-CN/scripts/557749-javdb%E5%BD%B1%E7%89%87%E7%AE%A1%E7%90%86%E5%99%A8',
    githubUrl: 'https://github.com/RiTian96/SurfHelper/blob/main/tampermonkey-scripts/javdb-manager.user.js',
    description: '[核心] 影片自动屏蔽(看过/想看)与智能评分(高分高亮/低分隐身)；[功能] 搜索精确高亮、详情页状态同步、悬浮大图预览、数据导入导出(JSON)、自动爬取个人列表；支持日产/欧美/FC2番号',
  },
  {
    name: 'Javdb自动搜索外部资源',
    tampermonkeyUrl: 'https://sleazyfork.org/zh-CN/scripts/553487-javdb%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90',
    description: '根据番号搜索外部资源,自动搜索影片的外部资源,包括BT下载,字幕,在线播放等等',
  },
  {
    name: '跳转到Emby播放',
    tampermonkeyUrl: 'https://sleazyfork.org/zh-CN/scripts/528750/post-install',
    description: '在 ✅JavBus✅Javdb✅Sehuatang ✅supjav 高亮emby存在的视频，并提供标注一键跳转功能',
  },
  {
    name: 'JavdBviewed',
    tampermonkeyUrl: '',
    githubUrl: 'https://github.com/Adsryen/JavdBviewed',
    description: 'Jav 助手是一个功能强大的浏览器扩展，专为 JavDB 等Jav视频网站设计。它能够在列表页和详情页标记视频的"已浏览"或"我看过"状态，并提供丰富的数据管理功能，包括 WebDAV 同步、数据导入导出、115网盘推送等高级特性。',
  },
  {
    name: '',
    tampermonkeyUrl: '',
    description: '',
  },
  {
    name: '',
    tampermonkeyUrl: '',
    description: '',
  },
  {
    name: '',
    tampermonkeyUrl: '',
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
      <!-- 链接列（最简写法，无任何冗余） -->
      <el-table-column
        prop="url"
        label="油猴脚本地址"
        width="160"
      >
        <template
          #default="scope"
        >
          <el-link
            v-if="scope.row.tampermonkeyUrl"
            :href="scope.row.tampermonkeyUrl"
            target="_blank"
            type="primary"
          >
            前往安装
          </el-link>
        </template>
      </el-table-column>
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
