<!------  2025-08-15---15:14---星期五  ------>
<!------------------------------------  Emby 入库列表   ------------------------------------------------->
<script lang="ts" setup>
import type { CSSProperties } from 'vue'

type PropsType = {

  /**
   *   视频
   */
  video: AdultType.VideoFile

  /**
   *   按钮宽度
   */
  width?: string | number

  /**
   *   按钮高度
   */
  height?: string | number

  /**
   *   圆角
   */
  radius?: string | number

  /**
   *   按钮类名
   */
  class?: string

  /**
   *   按钮样式
   */
  style?: CSSProperties
}

const props = withDefaults(defineProps<PropsType>(), {
  width: '',
  height: '',
  radius: 0,
  class: '',
})

const isShowCopy = ref(false)

const isHovered = ref(false) // 添加悬浮状态

/**
 *   视频目录结构
 */
const directoryPath = props.video.filePath.join('\\')

/**
 *   视频名称复制到 剪切板
 */
function videoNameCopyToClipboard(event: any) {
  event.preventDefault()

  copyToClipboard(props.video.cleanName)

  window.$notification.success('视频名称 已复制到剪切板')

  isShowCopy.value = !isShowCopy.value
}

/**
 *  视频位置复制到 剪切板
 */
function openFolder(event: any) {
  event.stopPropagation()
  event.preventDefault()

  copyToClipboard(directoryPath)

  window.$notification.success(`视频位置已复制到剪切板:  ${directoryPath}`)

  isHovered.value = false // 复制完,关闭悬浮层
}
</script>

<template>
  <div
    class="relative z-1000 m-x-auto m-t-2 w-[95%]"
    :class="props.class"
    :style="{
      borderRadius: `${radius}px`,
      height: typeof height === 'number' ? `${height}px` : `${height}`,
      width: typeof width === 'number' ? `${width}px` : `${width}`,
      ...style,
    }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <button
      class="relative w-full cursor-pointer touch-manipulation border-none bg-transparent p-0 outline-offset-[4px] transition-filter duration-250 ease-in-out focus-visible:outline-none focus:outline-none hover:brightness-[110%]"
      @click="videoNameCopyToClipboard"
    >
      <span
        class="absolute left-0 top-0 h-full w-full translate-y-[2px] transform rounded-[12px] bg-black/25 shadow transition-transform duration-[250ms] duration-[34ms] duration-[600ms] will-change-transform active:translate-y-[1px] hover:translate-y-[4px] active:transition-transform hover:transition-transform"
      />

      <span
        class="from-[hsl(167deg,from-from-[65%],from-from-13%)]"
      />

      <div
        class="relative block translate-y-[-4px] transform rounded-[12px] bg-[#219C90] p-[12px_27px] text-[1.1rem] transition-transform duration-[250ms] duration-[34ms] duration-[600ms] will-change-transform active:translate-y-[-2px] hover:translate-y-[-6px] !text-white active:transition-transform hover:transition-transform"
      >

        <!--  上层 -->
        <div
          class="mb-1 flex items-center justify-between"
        >
          <div
            class="flex items-center gap-2 text-4"
          >

            <div
              class="text-[#e6683c] font-bold"
            >
              {{ video.size }}
            </div>

            <div
              class=""
            >
              {{ video.resolution }}
            </div>
          </div>

          <div
            class="flex items-center gap-2"
          >
            <SvgIcon
              v-for="item in video.tags"
              :key="item"
              :icon="item"
              :size="30"
              class="m-r-1 !h-5 !w-5 !rounded-0"
            />
          </div>
        </div>

        <!--  下层 -->
        <div
          class="flex items-center justify-between"
        >
          <span
            class="flex-1 truncate text-start text-4"
          >
            {{ video.baseName }}
          </span>
        </div>
      </div>
    </button>

    <!-- 详情页  悬浮层 -->
    <div
      v-if="isHovered"
      class="absolute bottom-[110%] w-full origin-left scale-100 cursor-pointer select-text rounded-lg bg-[#fff] p-3 transition-all duration-300 ease-in-out"
      :style="{
        boxShadow: 'inset 20px 20px 8px #bebebe, inset -20px -20px 8px #ffffff',
      }"
      @click="openFolder"
    >
      <div
        class="border border-[#52382f] rounded-3 border-solid bg-[#2a2b2f] p-3"
      >
        <div
          class="p-t-1 text-[#ccc]"
        >
          {{ directoryPath }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
