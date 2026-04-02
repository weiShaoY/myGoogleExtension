<!------  2026-03-29---02:21---星期天  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import {
  getEmbyHomeUrl,
  getEmbyItemUrl,
  searchEmby,
} from '@/apis'

type PropsType = {

  /**
   * 视频名称
   */
  videoName: string

  /**
   *  是否设置弹窗使用
   */
  isFromSettingDialog?: boolean
}

const props = defineProps<PropsType>()

/**
 *  搜索 Emby 服务器上的视频
 *  @param  videoName - 视频名称
 */
async function embySearch(videoName: string) {
  console.log('🚀 ~ file: index.ts:10 ~ videoName:', videoName)

  try {
    const result = await searchEmby(videoName)

    //  如果结果为空，则提示没有找到
    if (result.Items.length === 0) {
      window.$messageBox
        .confirm(`是否打开 Emby 首页?`, 'Emby中没有找到该视频!', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          openEmbyTab(getEmbyHomeUrl())
        })
        .catch(() => {
          window.$notification.error('Emby中没有找到该视频!')
        })
    }

    //  如果只有一个结果，则直接打开
    else if (result.Items.length === 1) {
      const item = result.Items[0]

      const url = getEmbyItemUrl(item)

      openEmbyTab(url)
    }
    else {
      window.$notification.error('Emby中找到多个结果!')
      openEmbyTab(getEmbyHomeUrl())
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

/**
 * 使用 Chrome 扩展 API 打开 Emby 标签页
 * @param url - 要打开的 URL
 */
function openEmbyTab(url: string): void {
  chrome.runtime.sendMessage(
    {
      type: 'openEmbyTab',
      data: {
        url,
      },
    },
    (response) => {
      console.log('🚀 ~ file: adult-emby.vue:86 ~ response:', response)
      if (chrome.runtime.lastError) {
        console.error('打开标签页失败:', chrome.runtime.lastError)

        // 如果扩展 API 失败，尝试使用普通方法
        openLink(url)
      }
    },
  )
}

function embyBtnHandler() {
  if (!props.videoName) {
    return
  }

  console.log(
    '🚀 ~ file: adult-emby.vue:63 ~ videoName.value:',
    props.videoName,
  )

  embySearch(props.videoName)
}
</script>

<template>
  <div
    class="group relative box-border h-full w-full cursor-pointer overflow-hidden border-3 border-emby rounded-2 border-solid bg-white p-x-1"
    @click="embyBtnHandler"
  >
    <!-- 滑动背景 -->
    <div
      class="absolute inset-0 z-0 bg-emby transition-all duration-1000 -translate-x-full group-hover:translate-x-0"
    />

    <div
      class="grid grid-cols-2 h-full w-full w-full gap-2 [&>*:last-child:nth-child(1)]:col-span-2"
    >
      <!-- 文字 -->
      <div
        v-if="isFromSettingDialog"
        class="relative flex items-center pl-[20%] text-6 text-emby font-bold transition-colors duration-1000 group-hover:text-white"
      >
        {{ videoName }}
      </div>

      <!-- 图标：淡入淡出平滑切换 -->
      <div
        class="relative h-full flex items-center justify-center"
      >
        <!-- 默认图标 → 慢慢隐藏 -->
        <SvgIcon
          icon="content-adult-setting-emby"
          :size="30"
          class="absolute opacity-100 transition-opacity duration-1000 group-hover:opacity-0"
        />
        <!-- 悬浮图标 → 慢慢显示 -->
        <SvgIcon
          icon="content-adult-setting-embyHover"
          :size="30"
          class="absolute text-white opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
