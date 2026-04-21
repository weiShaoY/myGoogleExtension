<!------  2025-08-16---05:08---星期六  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

type Props = {

  /**
   *   视频名称
   */
  videoName: string

  /**
   *   大小
   */
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 60,
})

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
    const response = await fetch(videoThumbnailUrl.value)

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
    class="aspect-square flex cursor-pointer items-center justify-center justify-between rounded-2 bg-white p-1 transition-all duration-300 hover:scale-105"
    :style="{
      height: `${size + 5}px`,
      width: `${size + 5}px`,
    }"
    @click="handleClick"
  >
    <SvgIcon
      icon="thumbnail"
      :size="size"
    />
  </div>

  <el-dialog
    v-if="isShowVideoThumbnailDialog"
    v-model="isShowVideoThumbnailDialog"
    :title="videoName"
    width="70%"
    :show-close="false"
    :append-to-body="true"
  >

    <el-scrollbar
      height="60vh"
      always
    >
      <img
        :src="videoThumbnailUrl"
        alt="video thumbnail"
        class="h-full w-full object-cover"
      >
    </el-scrollbar>
  </el-dialog>
</template>

<style lang="scss" scoped>

</style>
