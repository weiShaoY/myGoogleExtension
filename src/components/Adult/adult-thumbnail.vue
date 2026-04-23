<script setup lang="ts">
import { parseSize, subtractSize } from '@/utils/size'

type Props = {

  /** 视频名称 */
  videoName: string

  /** 外壳大小 */
  size?: number | string

  /** 图标大小 */
  iconSize?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 60,
})

/** 偏移量 */
const THUMBNAIL_SIZE_OFFSET = 5

/** 弹窗状态 */
const isShowVideoThumbnailDialog = ref(false)

/** 是否显示按钮（默认不显示） */
const isThumbnailAvailable = ref(false)

/** 缩略图地址 */
const videoThumbnailUrl = computed(() =>
  `https://image.memojav.com/image/screenshot/${props.videoName.toLocaleUpperCase()}.jpg`,
)

/** 点击 */
function handleClick() {
  isShowVideoThumbnailDialog.value = true
}

/** 尺寸 */
const containerSize = computed(() => parseSize(props.size))

/** 图标尺寸 */
const resolvedIconSize = computed(() => {
  if (props.iconSize != null) {
    return parseSize(props.iconSize)
  }

  return subtractSize(props.size, THUMBNAIL_SIZE_OFFSET)
})

/**
 * 探测成功
 */
/**

 * 探测成功

 */

function handleDetectLoad(e: Event) {
  const img = e.target as HTMLImageElement

  const width = img.naturalWidth

  const height = img.naturalHeight

  // ❗关键：过滤“假图”

  const isFake

    = width === 0

      || height === 0

      || (width < 200 && height < 200) // 小图基本都是 fallback

  if (!isFake) {
    isThumbnailAvailable.value = true
  }
  else {
    isThumbnailAvailable.value = false
  }
}

/**
 * 探测失败
 */
function handleDetectError() {
  isThumbnailAvailable.value = false
}

/**
 * videoName 变化时重置
 */
watch(
  () => props.videoName,
  () => {
    isThumbnailAvailable.value = false
  },
)
</script>

<template>

  <!-- 👇 隐藏探测图（核心） -->
  <img
    :src="videoThumbnailUrl"
    class="hidden"
    @load="handleDetectLoad"
    @error="handleDetectError"
  >

  <!-- 👇 只有检测成功才显示按钮 -->
  <BaseButton
    v-if="isThumbnailAvailable"
    icon="thumbnail"
    :size="containerSize"
    :icon-size="resolvedIconSize"
    @click="handleClick"
  />

  <!-- 弹窗 -->
  <el-dialog
    v-model="isShowVideoThumbnailDialog"
    :title="videoName"
    width="70%"
    :show-close="false"
    append-to-body
  >
    <template
      #title
    >
      <div
        class="w-full flex items-center justify-between gap-5"
      >
        <span
          class="text-7 font-bold"
        >
          {{ videoName }}
        </span>

        <BaseButton
          icon="external"
          :size="40"
          tooltip-content="新标签页打开"
          tooltip-placement="top"
          @click="openLink(videoThumbnailUrl)"
        />
      </div>
    </template>

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
