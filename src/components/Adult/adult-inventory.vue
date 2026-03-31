<!------  2026-03-29---00:34---星期天  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

type PropsType = {

  /**
   *   视频
   */
  file: AdultType.VideoFile

}

const props = withDefaults(defineProps<PropsType>(), {

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
  const path = props.file.filePath.join('\\')

  copyToClipboard((path), {
    title: '文件位置 复制到剪切板',
    message: path,
  })
}
</script>

<template>
  <div
    class="box-border w-full origin-left scale-100 cursor-pointer select-text overflow-hidden rounded-lg bg-[#fff] p-2 text-white transition-all duration-300 ease-in-out"
    :style="{
      boxShadow: 'inset 20px 20px 8px 20px #bebebe, inset -20px -20px 8px 20px #ffffff',
    }"
  >
    <div
      class="box-border h-full w-full border border-[#52382f] rounded-3 border-solid bg-[#2a2b2f] p-2"
    >

      <div
        class="flex items-center justify-between"
      >
        <div
          class="text-5 hover:text-emby"
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
        class="mt-2 break-all hover:text-emby"
        @click="copyFilePath"
      >
        {{ props.file.filePath.join('\\') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
