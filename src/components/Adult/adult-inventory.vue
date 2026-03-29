<!------  2026-03-29---00:34---星期天  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import type { CSSProperties } from 'vue'

type PropsType = {

  /**
   *   视频
   */
  file: FolderConfigType.File

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

/**
 *  视频位置复制到 剪切板
 */
function copyFileName() {
  copyToClipboard((props.file.cleanName), {
    title: '文件名 已复制到剪切板',
    message: props.file.cleanName,
  })
}

function copyFilePath() {
  const path = props.file.directoryPath.join('\\')

  copyToClipboard((path), {
    title: '文件位置 复制到剪切板',
    message: path,
  })
}
</script>

<template>

  <div
    class="col-span-2 w-full origin-left scale-100 cursor-pointer select-text rounded-lg bg-[#fff] p-3 transition-all duration-300 ease-in-out"
    :style="{
      boxShadow: 'inset 20px 20px 8px #bebebe, inset -20px -20px 8px #ffffff',
    }"
  >
    <div
      class="h-full border border-[#52382f] rounded-3 border-solid bg-[#2a2b2f] p-3"
    >

      <div
        class="flex items-center justify-between"
      >
        <div
          class="text-5 hover:text-primary"
          @click="copyFileName"
        >
          {{ props.file.cleanName }}
        </div>

        <div
          class="text-[#e6683c]"
        >
          0.04GB
        </div>
      </div>

      <div
        class="mt-2 hover:text-primary"
        @click="copyFilePath"
      >
        {{ props.file.directoryPath.join('\\') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
