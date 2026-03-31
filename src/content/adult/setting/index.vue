<!------------------------------------  设置按钮  ------------------------------------------------->
<script lang="ts" setup>
import { useAdultStore } from '@/stores'

import FolderScanner from './folderScanner.vue'

const adultStore = useAdultStore()

/**
 *  全局的加载状态
 */
const isLoading = ref(false)

const isShowMainDialog = ref(true)

function onClick() {
  isShowMainDialog.value = true
}

/**
 *  菜单栏激活项
 */
const activeIndex = ref('0')

function handleSelect(key: string) {
  activeIndex.value = key
}

</script>

<template>
  <div
    class="group fixed bottom-10 left-10 inline-flex overflow-visible border-2 rounded-full transition-all duration-300 !z-1000000000000"
  >
    <!-- 主按钮 -->
    <button
      class="group relative cursor-pointer overflow-hidden border border-green-500/20 rounded-full from-black/60 to-black/40 bg-gradient-to-tr p-5 shadow-lg backdrop-blur-lg transition-all duration-300 ease-out active:rotate-0 hover:rotate-2 active:scale-95 hover:scale-110 hover:border-green-500/50 hover:from-green-500/10 hover:to-black/40 hover:bg-gradient-to-tr hover:shadow-2xl hover:shadow-green-500/30"
      @click="onClick"
    >
      <div
        class="absolute inset-0 from-transparent via-green-400/20 to-transparent bg-gradient-to-r transition-transform duration-700 ease-out -translate-x-full group-hover:translate-x-full"
      />

      <div
        class="relative z-10"
      >
        <SvgIcon
          v-if="!isLoading"
          icon="adult-setting-emby"
          :size="30"
        />

        <SvgIcon
          v-else
          icon="adult-setting-emby"
          :size="30"
          class="!animate-spin"
          style="--animate-duration: 3s"
        />
      </div>
    </button>
  </div>

  <!-- 主弹窗 -->
  <el-dialog
    v-if="isShowMainDialog"
    v-model="isShowMainDialog"
    width="70%"
    :close-on-click-modal="false"
    :lock-scroll="true"
    :append-to-body="true"
  >
    <div
      v-loading="isLoading"
      class="layout-sidebar h-[60vh] w-full flex justify-between"
    >
      <!-- 左侧菜单 -->
      <el-menu
        class="h-full w-[15vw]"
        :default-active="activeIndex"
        :default-openeds="['1', '1-1', '1-2']"
        @select="handleSelect"
      >
        <el-menu-item
          index="0"
          class="m-x-auto mb-2 w-[calc(100%-16px)] rounded-3"
        >
          <SvgIcon
            icon="folderScanner"
            class="mr-3"
          />

          <span
            class="menu-name"
          > 文件夹扫描 </span>
        </el-menu-item>

        <!-- Find Duplicate -->
        <el-sub-menu
          v-if="
            adultStore.embyFolder.folderDuplicateVideoFiles.length > 0
              || adultStore.embyFolder.folderUniqueVideoNames.length > 0
          "
          index="1"
          class="m-x-auto mb-2 w-[calc(100%-16px)] rounded-3"
        >
          <template
            #title
          >
            <SvgIcon
              icon="findDuplicate"
              class="mr-3"
            />

            <span> 查找重复 </span>
          </template>

          <el-menu-item
            index="1-1"
            class="m-x-auto mb-2 w-[calc(100%-16px)] rounded-3"
          >
            <SvgIcon
              icon="adult-setting-allDuplicate"
              class="mr-3"
            />
            所有重复
          </el-menu-item>

          <el-menu-item
            index="1-2"
            class="m-x-auto mb-2 w-[calc(100%-16px)] rounded-3"
          >
            <SvgIcon
              icon="adult-setting-uniqueDuplicate"
              class="mr-3"
            />
            去重重复
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

      <!-- 右侧内容 -->
      <div
        class="h-full flex items-center justify-center !flex-1"
      >
        <FolderScanner
          v-if="activeIndex === '0'"
          v-model:is-loading="isLoading"
        />

        <!-- <AllDuplicate
          v-else-if="activeIndex === '1-1'"
        /> -->

        <!-- <UniqueDuplicate
          v-else-if="activeIndex === '1-2'"
        /> -->

        <!-- 所有重复 AllDuplicate -->
        <template
          v-else-if="activeIndex === '1-1'"
        >
          <el-scrollbar
            always
            class="w-full"
            view-class="p-5 box-border"
          >
            <AdultEmby
              v-for="(item, index) in adultStore.embyFolder
                .folderDuplicateVideoFiles"
              :key="index"
              :video-name="item.cleanName"
              :is-from-setting-dialog="true"
              class="mb-3 !h-15"
            />
          </el-scrollbar>
        </template>

        <!-- 去重重复 UniqueDuplicate -->
        <template
          v-else-if="activeIndex === '1-2'"
        >
          <el-scrollbar
            always
            class="w-full"
            view-class="p-5 box-border"
          >
            <AdultEmby
              v-for="(item, index) in adultStore.embyFolder
                .folderUniqueVideoNames"
              :key="index"
              :video-name="item"
              :is-from-setting-dialog="true"
              class="mb-3 !h-15"
            />
          </el-scrollbar>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.el-sub-menu__title {
  margin: 0 auto !important;
  margin-bottom: 8px !important;
  // width: calc(100% - 16px) !important;
  border-radius: 12px !important;
}
// 右侧箭头
.el-sub-menu__icon-arrow {
  right: 20px;
  width: 15px !important;
  font-weight: bold;
}

// 选中颜色
.el-menu-item.is-active {
  // color: red !important;
  background-color: #f2f4f5;
}
</style>
