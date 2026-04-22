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

  <BaseButton
    icon="thumbnail"
    :size="containerSize"
    :icon-size="resolvedIconSize"
    @click="handleClick"
  />

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
        class="!w-full"
      >
    </el-scrollbar>
  </el-dialog>
</template>

<style scoped lang="scss">
</style>
