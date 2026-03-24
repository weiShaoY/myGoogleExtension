<!------  2026-03-24---13:13---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

import { SearchConfig } from '@/configs'

const currentSearchEngine = ref<SearchConfigType.SiteItem | null>(null)

const searchKeyword = ref('')

/**
 * 根据ID获取搜索框的值
 */
function getSearchValueById(id: string): string {
  try {
    const element = document.getElementById(id)

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return element.value.trim()
    }

    return ''
  }
  catch (error) {
    console.warn(`获取搜索框值失败 (ID: ${id}):`, error)
    return ''
  }
}

/**
 * 根据class获取搜索框的值
 */
function getSearchValueByClass(className: string): string {
  try {
    const element = document.querySelector(className)

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return element.value.trim()
    }

    return ''
  }
  catch (error) {
    console.warn(`获取搜索框值失败 (Class: ${className}):`, error)
    return ''
  }
}

function getSearchValueByIndex(index: number): string {
  const inputs = document.getElementsByTagName('input')

  return inputs[index]?.value.trim() || ''
}

/**
 * 从指定搜索引擎获取关键词
 */
function getKeywordFromEngine(engine: SearchConfigType.SiteItem): string {
  if (engine.inputId) {
    return getSearchValueById(engine.inputId)
  }

  if (engine.inputClass) {
    return getSearchValueByClass(engine.inputClass)
  }

  if (engine.inputIndex) {
    return getSearchValueByIndex(engine.inputIndex)
  }

  return ''
}

/**
 * 获取搜索关键词
 */
function getSearchKeyword(): string {
  let keyword = ''

  let matchedEngine: SearchConfigType.SiteItem | null = null

  // 遍历搜索引擎列表
  for (const item of SearchConfig.siteList) {
    if (item.siteList) {
      // 检查子菜单中的搜索引擎
      for (const subItem of item.siteList) {
        if (subItem.hostname && isHostnameMatch(subItem.hostname)) {
          keyword = getKeywordFromEngine(subItem)
          if (keyword) {
            matchedEngine = subItem
            break
          }
        }
      }

      if (keyword) {
        break
      }
    }
    else {
      // 检查顶级搜索引擎
      if (item.hostname && isHostnameMatch(item.hostname)) {
        keyword = getKeywordFromEngine(item)
        if (keyword) {
          matchedEngine = item
          break
        }
      }
    }
  }

  // 更新状态
  if (keyword && matchedEngine) {
    searchKeyword.value = keyword
    currentSearchEngine.value = matchedEngine
    console.log('检测到搜索关键词:', keyword, '来自:', matchedEngine.name)
  }

  return keyword
}

/**
 * 执行搜索
 */
async function handlePerformSearch(engine: SearchConfigType.SiteItem): Promise<void> {
  try {
    // 设置当前搜索引擎
    currentSearchEngine.value = engine

    // 检查是否在当前页面
    if (engine.hostname && isHostnameMatch(engine.hostname)) {
      console.log('当前页面匹配，不执行搜索')
      window.$notification.warning('点击的是当前页面搜索引擎,不执行搜索')
      return
    }

    // 获取搜索关键词（优先级：页面关键词 > 剪贴板内容）
    let searchText = getSearchKeyword()

    if (!searchText) {
      try {
        searchText = await getClipboardText()
        if (searchText) {
          console.log('使用剪贴板内容作为搜索关键词:', searchText)
        }
      }
      catch (clipboardError) {
        console.warn('获取剪贴板内容失败:', clipboardError)
      }
    }

    // 构建搜索URL
    let searchUrl = engine.searchUrl

    if (searchText) {
      searchUrl += encodeURIComponent(searchText)
    }

    // 执行搜索
    console.log('执行搜索:', searchUrl)

    if (searchUrl) {
      openLink(searchUrl)
    }
  }
  catch (error) {
    console.error('搜索执行失败:', error)
  }
}

// 组件挂载时获取搜索关键词
onMounted(() => {
  getSearchKeyword()
})
</script>

<template>
  <div
    class="fixed bottom-3 left-2 z-99999 flex flex-col gap-3 overflow-hidden border rounded-xl bg-white shadow-lg transition-all duration-200 ease-in-out"
    style="border-color: rgba(0, 0, 0, 0.1)"
  >
    <!-- 当前搜索引擎显示 -->
    <div
      v-if="currentSearchEngine"
      class="mb-2 text-xs text-gray-500"
    >
      当前: {{ currentSearchEngine.name }}
    </div>

    <!-- 搜索关键词显示 -->
    <div
      v-if="searchKeyword"
      class="mb-2 text-xs text-gray-600"
    >
      关键词: {{ searchKeyword }}
    </div>

    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
    >
      <!-- 搜索引擎菜单项 -->
      <template
        v-for="item in SearchConfig.siteList"
        :key="item.name"
      >
        <!-- 有子菜单的项目 -->
        <el-sub-menu
          v-if="item.siteList"
          :index="item.name"
        >
          <template
            #title
          >
            <span>{{ item.name }}</span>
          </template>

          <el-menu-item
            v-for="subItem in item.siteList"
            :key="subItem.name"
            :index="subItem.name"
            @click="handlePerformSearch(subItem)"
          >
            <SvgIcon
              :icon="subItem.icon"
              size="20"
              class="mr-2"
            />
            {{ subItem.name }}
          </el-menu-item>
        </el-sub-menu>

        <!-- 没有子菜单的项目 -->
        <el-menu-item
          v-else
          :index="item.name"
          @click="handlePerformSearch(item)"
        >
          <SvgIcon
            :icon="item.icon"
            size="20"
            class="mr-2"
          />
          {{ item.name }}
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>

</style>
