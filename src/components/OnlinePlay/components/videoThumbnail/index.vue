<!------  2025-08-16---05:08---星期六  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

import { gmGet } from '@/utils'

type Props = {

  /**
   *   视频名称
   */
  videoName: string
}

const props = defineProps<Props>()

/**
 *  是否显示缩略图
 */
const isShowThumbnail = ref(false)

/**
 *  视频缩略图 URL
 */
const videoThumbnailUrl = ref(`https://image.memojav.com/image/screenshot/${props.videoName.toLocaleUpperCase()}.jpg`)

/**
 *  是否显示视频缩略图弹窗
 */
const isShowVideoThumbnailDialog = ref(false)

async function handleClick() {
  isShowVideoThumbnailDialog.value = true
}

onMounted(async () => {
  try {
    const response = await gmGet(videoThumbnailUrl.value)

    if (response.status === 200) {
      isShowThumbnail.value = true
    }
  }
  catch (error) {
    console.error('获取视频缩略图失败:', error)
    window.$notification.error(
      {
        title: '获取视频缩略图失败',
        duration: 0,
      },
    )
  }
})

</script>

<template>

  <div
    v-if="isShowThumbnail"
    class="aspect-square flex flex-col cursor-pointer justify-between rounded-2 bg-white p-1 transition-all duration-300 !w-30 hover:scale-105"
    :style="{ border: `4px solid #67c23a` }"
    @click="handleClick"
  >

    <div
      class="flex flex-1 items-center justify-center gap-3"
    >
      <SvgIcon
        icon="thumbnail"
        :size="40"
      />
    </div>

    <div
      class="w-full flex justify-center text-sm font-bold"
    >
      视频缩略图
    </div>
  </div>

  <el-dialog
    v-if="isShowVideoThumbnailDialog"
    v-model="isShowVideoThumbnailDialog"
    :title="videoName"
    width="70%"
    :show-close="false"
  >

    <el-scrollbar
      height="60vh"
      always
    >
      <img
        :src="`https://image.memojav.com/image/screenshot/${videoName.toLocaleUpperCase()}.jpg`"
        alt="video thumbnail"
        class="h-full w-full object-cover"
      >
    </el-scrollbar>
  </el-dialog>
</template>

<style lang="less" scoped>

</style>
