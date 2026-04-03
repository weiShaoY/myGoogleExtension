<!------------------------------------  跳转在线播放   ------------------------------------------------->
<script setup lang="ts">

import { onlinePlayConfig } from '@/configs'

import VideoThumbnail from './components/videoThumbnail/index.vue'

import Site from './site.vue'

defineProps<PropsType>()

type PropsType = {

  /**
   *  挂载点
   */
  to: string

  /**
   *  视频名称
   */
  videoName: string
}

</script>

<template>

  <Teleport
    :to="to"
  >
    <div
      class="flex border-gray-300 rounded-2 bg-white p-3 shadow-md ease-in-out"
      :style="{
        boxShadow: 'inset 20px 20px 8px #bebebe, inset -20px -20px 8px #EBEBEB',
      }"
    >
      <div
        class="grid w-full gap-6 rounded-2 bg-[#2a2b2f] p-3"
        :style="{
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        }"
      >
        <VideoThumbnail
          :video-name="videoName"
        />

        <!-- 遍历站点列表，根据条件渲染 SiteBtn 组件 -->
        <template
          v-for="siteItem in onlinePlayConfig.siteList"
          :key="siteItem.name"
        >
          <Site
            :site-item="siteItem"
            :code="videoName"
          />
        </template>

      </div>
    </div>
  </Teleport>

  <!-- // thumbnail -->
  <!-- https://image.memojav.com/image/screenshot/${this.fanHao}.jpg -->
</template>

<style lang="less" scoped>

</style>
