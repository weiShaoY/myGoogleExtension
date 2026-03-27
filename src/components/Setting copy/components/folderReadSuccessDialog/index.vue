<!------------------------------------  是否显示文件夹读取成功弹窗  ------------------------------------------------->
<script lang="ts" setup>

import { useFolderStore } from '@/stores'

type Props = {

  /**
   * 读取文件夹耗时
   */
  folderReadTime: string
}
defineProps<Props>()

const visible = defineModel<boolean>({
  required: true,
})

const folderStore = useFolderStore()

function handleClose() {
  window.location.reload()
}

</script>

<template>

  <el-dialog
    v-model="visible"
    width="50%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- :show-close="false" -->

    <template
      #title
    >
      <div
        class="w-full flex items-center justify-center font-semibold"
      >
        <span
          class=""
        >
          文件夹
        </span>

        <el-link
          class="m-x-2 w-[30%] truncate text-center font-bold !block !p-3 !text-6"
          type="success"
          underline="always"
        >
          {{ folderStore.embyFolder.folderName }}
        </el-link>

        <span
          class=""
        >
          读取成功
        </span>
      </div>

      <el-divider />

    </template>

    <div
      class="w-auto font-semibold"
    >

      <el-timeline
        class="mt-4"
        mode="alternate-reverse"
      >
        <el-timeline-item>
          <div
            class="flex items-center justify-end"
          >
            <span>
              总耗时
            </span>

            <span
              class="color-primary m-x-2 text-6 font-bold"
            >
              {{ folderReadTime }}
            </span>

            <span>
              秒
            </span>

          </div>

        </el-timeline-item>

        <el-timeline-item>
          <div
            class="flex items-center"
          >
            <span>
              共读取
            </span>

            <span
              class="color-primary m-x-2 text-6 font-bold"
            >
              {{ folderStore.embyFolder.folderFileList.length }}
            </span>

            <span>
              部
            </span>
          </div>
        </el-timeline-item>

        <el-timeline-item>
          <div
            class="flex items-center justify-end"
          >
            <span>
              共发现
            </span>

            <span
              class="color-primary m-x-2 text-6 font-bold"
            >
              {{ folderStore.embyFolder.folderDuplicateNameFileList.length }}
            </span>

            <span>
              部重复视频
            </span>
          </div>
        </el-timeline-item>

        <el-timeline-item>
          <div
            class="flex items-center"
          >
            <span>
              去重后
            </span>

            <span
              class="color-primary m-x-2 text-6 font-bold"
            >
              {{ folderStore.embyFolder.folderUniqueFileNameFileList.length }}
            </span>

            <span>
              部
            </span>
          </div>
        </el-timeline-item>
      </el-timeline>

    </div>
  </el-dialog>
</template>

<style lang="less" scoped>

</style>
