<!------  2025-08-16---05:08---星期六  ------>
<!------------------------------------    ------------------------------------------------->
<script setup lang="ts">
import { parseSize, subtractSize } from '@/utils/size'

type Props = {

  /**
   * 视频名称
   */
  videoName: string

  /**
   * 外壳大小（容器尺寸）
   */
  size?: number | string

  /**
   * 图标大小（可选，不传则默认 size - offset）
   */
  iconSize?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 60,
})

/**
 * 容器尺寸偏移量
 */
const THUMBNAIL_SIZE_OFFSET = 5

/**
 * 是否显示缩略图
 */
const isShowThumbnail = ref(false)

/**
 * 弹窗状态
 */
const isShowVideoThumbnailDialog = ref(false)

/**
 * 缩略图 URL
 */
const videoThumbnailUrl = computed(() =>
  `https://image.memojav.com/image/screenshot/${props.videoName.toLocaleUpperCase()}.jpg`,
)

/**
 * 点击
 */
function handleClick() {
  isShowVideoThumbnailDialog.value = true
}

/**
 * 检测缩略图是否存在
 */
async function checkThumbnailExists(url: string) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
    })

    return response.ok
  }
  catch (error) {
    console.error('获取视频缩略图失败:', error)

    window.$notification?.error?.({
      title: '获取视频缩略图失败',
      duration: 0,
    })

    return false
  }
}

/**
 * 初始化
 */
async function init() {
  const ok = await checkThumbnailExists(videoThumbnailUrl.value)

  isShowThumbnail.value = ok
}

onMounted(init)

/**
 * 容器尺寸（统一解析）
 */
const containerSize = computed(() =>
  parseSize(props.size),
)

/**
 * 图标尺寸
 * 👉 如果传 iconSize 就用 iconSize
 * 👉 否则 = size - 5
 */
const resolvedIconSize = computed(() => {
  if (props.iconSize !== undefined && props.iconSize !== null) {
    return parseSize(props.iconSize)
  }

  return subtractSize(props.size, THUMBNAIL_SIZE_OFFSET)
})
</script>

<template>
  <div
    v-if="isShowThumbnail"
    class="aspect-square flex cursor-pointer items-center justify-center rounded bg-white transition-all duration-300 hover:scale-105"
    :style="{
      width: containerSize,
      height: containerSize,
    }"
    @click="handleClick"
  >
    <SvgIcon
      icon="thumbnail"
      :size="resolvedIconSize"
    />
  </div>

  <el-dialog
    v-model="isShowVideoThumbnailDialog"
    :title="videoName"
    width="70%"
    :show-close="false"
    append-to-body
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

<style scoped lang="scss">
</style>
