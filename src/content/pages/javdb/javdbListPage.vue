<!------------------------------------    ------------------------------------------------->
<script setup lang="ts">

import AdultInventory from '@/components/Adult/adult-inventory.vue'

// const addedToInventoryBtnList = ref<FolderConfigType.File[]>([])

const folderStore = useFolderStore()

const testShow = ref<boolean>(false)

const allList = ref<any[]>([])

function main() {
  $$('.movie-list .item').forEach((item) => {
    const name = item.querySelector('strong')?.textContent

    const cleanName = cleanVideoName(name)

    if (!cleanName) {
      return
    }

    /**
     *  目标元素
     */
    const boxElement = asHTMLElement(item.querySelector('.box'))

    /**
     *  匹配已入库视频
     */
    const matchedList = folderStore.matchVideos(cleanName)

    if (matchedList.length) {
      boxElement?.classList.add(cleanName)
      boxElement?.classList.add('is-highlight')

      const only = ref({
        fileName: cleanName,
        fileList: matchedList,
        isShowUpdateChinese: false,
        isShowEmby: true,
      })

      const hasChineseTag = !!item.querySelector('.is-warning')

      matchedList.forEach((video) => {
        // 需要更新中文
        if (!video.hasChineseSubtitles && hasChineseTag) {
          only.value.isShowUpdateChinese = true
        }
      })
      allList.value.push(only.value)
    }
  })

  testShow.value = true
  console.log('🚀 ~ file: javdbListPage.vue:90 ~ testShow.value:', testShow.value)

  console.log('🚀 ~ file: javdbListPage.vue:96 ~ allList.value:', allList.value)
}

onMounted(() => delayRun(main))
</script>

<template>

  <template
    v-for="value in allList"
    :key="value.fileName"
  >
    <Teleport
      :to="`.${value.fileName}`"
    >
      <div
        class="grid grid-cols-2 grid-rows-2 w-full gap-2 text-white font-bold"
      >
        <AdultInventory
          v-for="(item,) in value.fileList"
          :key="item.id"
        />

        <AdultChinese
          v-if="value.isShowUpdateChinese"
        />

        <AdultEmby />

      </div>
    </Teleport>
  </template>

</template>

<style lang="scss" scoped></style>
