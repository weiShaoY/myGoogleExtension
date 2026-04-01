<!------------------------------------  磁链列表  ------------------------------------------------->
<script lang="ts" setup>
import { computed } from 'vue'

import { AdultConfig } from '@/configs'

type PropsType = {

  /**
   *  挂载点
   */
  to?: string

  /**
   *  种子列表
   */
  torrentList?: AdultType.TorrentItem[]
}

const props = withDefaults(defineProps<PropsType>(), {
  to: '',
  torrentList: (): AdultType.TorrentItem[] => [],
})

/**
 *  有中文字幕的数量
 */
const chineseCount = computed(
  () =>
    props.torrentList.filter(item => item.tags.includes('tag-ziMu')).length,
)

/**
 *  复制种子链接
 */
function copyTorrentUrl(torrent: AdultType.TorrentItem) {
  if (!torrent.url) {
    window.$notification?.error('传入磁链为空, 无法复制,请检查代码')
    return
  }

  copyToClipboard?.(torrent.url, {
    title: `${torrent.name} 已复制到剪切板`,
    message: `${torrent.url} `,
  })
}

/**
 * 根据种子项计算背景颜色和标签
 * @param  torrent - 种子项
 * @returns  背景颜色和标签信息
 */
function getTorrentStyle(torrent: AdultType.TorrentItem) {
  const matchingRule = AdultConfig.rules.torrentSortRules.find(rule =>
    torrent.name.includes(rule.name),
  )

  return matchingRule
    ? {
        backgroundColor: matchingRule.backgroundColor,
        web: matchingRule.web || '',
      }
    : {
        backgroundColor: '',
        web: '',
      }
}

/**
 * 排序后的种子列表
 */
const sortedTorrentList = computed(() => {
  return [...props.torrentList].sort((videoA, videoB) => {
    console.log('🚀 ~ file: adult-torrent.vue:74 ~ videoA:', videoA.name)
    console.log('🚀 ~ file: adult-torrent.vue:74 ~ videoB:', videoB.name)

    /**
     *   视频A在排序规则数组中的位置   （-1 代表不在数组中）
     */
    const indexA = AdultConfig.rules.torrentSortRules.findIndex(rule =>
      videoA.name.includes(rule.name),
    )

    /**
     *   视频B在排序规则数组中的位置   （-1 代表不在数组中）
     */
    const indexB = AdultConfig.rules.torrentSortRules.findIndex(rule =>
      videoB.name.includes(rule.name),
    )

    console.log('🚀 ~ file: adult-torrent.vue:83 ~ indexA:', indexA)
    console.log('🚀 ~ file: adult-torrent.vue:83 ~ indexB:', indexB)

    // # ////////////////////////////////////////  1.在规则数组中，按数组里关键词的顺序排序,如果关键词的顺序一样了,按文件大小排序  ////////////////////////////////////////
    // videoA在规则数组中 videoB不在规则数组中 则videoA应该排在videoB前面  应该返回 -1
    if (indexA !== -1 && indexB === -1) {
      return -1
    }

    // videoA不在规则数组中，videoB在，videoB排前面
    //  videoA不在规则数组中 videoB在规则数组中 则videoB应该排在videoA前面  应该返回 1
    if (indexA === -1 && indexB !== -1) {
      return 1
    }

    // 两者都在规则数组中
    if (indexA !== -1 && indexB !== -1) {
      // 关键词顺序一样，按文件大小排序
      if (indexA === indexB) {
        //  如果 videoA 的 文件大小 大于 videoB 的文件大小，则应该返回 -1 将 videoA 排在 videoB 前面
        return videoA.size > videoB.size ? -1 : 1
      }

      // 关键词顺序不一样，按关键词顺序排序
      return indexA < indexB ? -1 : 1
    }

    // # ////////////////////////////////////////  2. 文件名是纯小写的，按文件大小排序  ////////////////////////////////////////
    const isLowerCaseA = /^[a-z0-9.-]+$/.test(videoA.name)

    const isLowerCaseB = /^[a-z0-9.-]+$/.test(videoB.name)

    // 两者都是纯小写，按文件大小排序
    //  如果 videoA 和 videoB 都是纯小写的，则按文件大小排序
    if (isLowerCaseA && isLowerCaseB) {
      //  如果 videoA 的 文件大小 大于 videoB 的文件大小，则应该返回 -1 将 videoA 排在 videoB 前面
      return videoA.size > videoB.size ? -1 : 1
    }

    // videoA是纯小写，videoB不是，videoA排前面
    //  如果 videoA 是纯小写的，videoB 是不是纯小写的 则将 videoA 排在 videoB 前面
    if (isLowerCaseA && !isLowerCaseB) {
      return -1
    }

    // videoA不是纯小写，videoB是，videoB排前面
    // 如果 videoA 是不是纯小写的，videoB 是纯小写的 则将 videoB 排在 videoA 前面
    if (!isLowerCaseA && isLowerCaseB) {
      return 1
    }

    // # ////////////////////////////////////////  3. 其他情况，按文件大小排序  ////////////////////////////////////////
    // 如果 videoA 的大小 大于 videoB 的大小，则应该返回 -1 将 videoA 排在 videoB 前面
    return videoA.size > videoB.size ? -1 : 1
  })
})
</script>

<template>
  <Teleport
    :to="props.to"
  >
    <div
      class="mx-auto my-10 w-full border rounded-2 bg-white p-6 pb-1"
    >
      <!-- 标题部分 -->
      <div
        class="flex flex-wrap items-center justify-between -m-2"
      >
        <div
          class="flex items-center justify-center text-4 font-semibold text-stroke-black"
        >
          <span> 共 </span>

          <span
            class="m-x-2 text-6 text-[#000] font-bold"
          >
            {{ sortedTorrentList.length }}
          </span>

          <span> 部 </span>
        </div>

        <div
          v-if="chineseCount"
          class="flex items-center justify-center text-4 text-[#F59E0B] font-semibold"
        >
          <span
            class="m-x-2 text-6 text-[#FF8400] font-bold"
          >
            {{ chineseCount }}
          </span>

          <span> 部有中文字幕 </span>
        </div>
      </div>

      <div
        class="m-y-5"
      >
        <!-- # -----------------------------------------------  列表循环  Start  ------------------------------------------------->
        <div
          v-for="(torrent, index) in sortedTorrentList"
          :key="torrent.name || index"
        >
          <div
            class="group relative z-0 h-[6em] flex cursor-pointer items-center justify-between overflow-hidden rounded-2 p-2"
            :style="{
              backgroundColor: getTorrentStyle(torrent).backgroundColor,
            }"
          >
            <!-- 悬浮动画 -->
            <div
              class="absolute z-[-1] h-[5em] w-[5em] rounded-full duration-500 -left-[4.5em] -top-[4.5em] group-hover:scale-[4500%]"
              :style="{
                background: 'linear-gradient(to right,#2233AA,#ADFF2F)',
              }"
            />

            <!-- 左边 -->
            <div
              class="flex items-center"
            >
              <!-- 磁链信息 -->
              <div
                class="w-100 p-2"
              >
                <!-- 磁链名称 -->
                <div
                  class="truncate text-4 font-bold group-hover:text-[#fff]"
                  :style="{
                    color: getTorrentStyle(torrent).backgroundColor
                      ? '#fff'
                      : '#000',
                  }"
                >
                  {{ torrent.name }}
                </div>

                <!-- 磁链时间 -->
                <div
                  class="m-t-1 text-3 font-semibold !group-hover:text-[#fff]"
                  :style="{
                    color: getTorrentStyle(torrent).backgroundColor
                      ? '#fff'
                      : '#9CA3AF',
                  }"
                >
                  {{ torrent.time }}
                </div>
              </div>

              <!-- 网站 信息 -->
              <div
                class="m-l-3 w-30 group-hover:text-[#fff]"
              >
                <span
                  v-if="torrent.source"
                  class="text-4 font-bold"
                >
                  {{ getTorrentStyle(torrent).web }}
                </span>
              </div>

              <!-- 文件大小 -->
              <div
                class="m-l-3 w-30 group-hover:text-[#fff]"
              >
                <span
                  v-if="torrent.size"
                  class="text-4 font-bold"
                >
                  {{ torrent.size }}
                </span>

                <span
                  v-if="torrent.size"
                  class="font-semibold"
                > GB </span>
              </div>

              <!-- 标签图标 -->
              <div
                v-for="tag in torrent.tags"
                :key="tag"
                class="m-x-3"
              >
                <SvgIcon
                  :icon="tag"
                  class="!h-10 !w-10"
                />
              </div>
            </div>

            <!-- 右边 -->
            <div
              class="w-auto p-2"
            >
              <el-button
                @click="copyTorrentUrl(torrent)"
              >
                复制
              </el-button>
            </div>
          </div>

          <div
            v-if="index < sortedTorrentList.length - 1"
            class="m-y-2 h-[1px] rounded bg-[#9CA3AF]"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="less" scoped></style>
