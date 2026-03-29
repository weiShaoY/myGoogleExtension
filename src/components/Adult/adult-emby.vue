<!------  2026-03-29---02:21---星期天  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { AdultApi } from '@/apis'

const cleanName = defineModel<string>('cleanName', {
  default: '',
})

/**
 *  搜索 Emby 服务器上的视频
 *  @param  videoName - 视频名称
 */
async function embySearch(videoName: string) {
  console.log('🚀 ~ file: index.ts:10 ~ videoName:', videoName)

  try {
    const result = await AdultApi.searchEmby(videoName)

    //  如果结果为空，则提示没有找到
    if (result.Items.length === 0) {
      window.$messageBox
        .confirm(`是否打开 Emby 首页?`, 'Emby中没有找到该视频!', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          openLink(AdultApi.getEmbyHomeUrl())
        })
        .catch(() => {
          window.$notification.error('Emby中没有找到该视频!')
        })
    }

    //  如果只有一个结果，则直接打开
    else if (result.Items.length === 1) {
      const item = result.Items[0]

      const url = getEmbyItemUrl(item)

      openLink(url)
    }
    else {
      window.$notification.error('Emby中找到多个结果!')
      openLink(getEmbyHomeUrl())
    }
  }
  catch (error) {
    console.error('Emby 搜索失败:', error)
    window.$notification.error({
      title: '请求失败, 请检查 Emby 服务器',
      duration: 5000,
    })
  }
}

console.log('🚀 ~ file: adult-emby.vue:8 ~ cleanName.value:', cleanName.value)

function embyBtnHandler() {
  console.log('🚀 ~ file: adult-emby.vue:12 ~ embyBtnHandler:', cleanName.value)
  embySearch(cleanName.value)
}
</script>

<template>
  <div
    class="aspect-square flex flex-col cursor-pointer items-center justify-center gap-3 rounded-3 bg-white text-4 text-amber font-bold duration-300 hover:scale-105"
    @click="embyBtnHandler"
  >
    <SvgIcon
      icon="adult-emby"
      :size="70"
    />
  </div>
</template>

<style lang="scss" scoped></style>
