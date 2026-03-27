<!------  2026-03-27---00:44---星期五  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import Info from './info.vue'

import Menu from './menu.vue'

import Read from './read.vue'

const folderStore = useFolderStore()

const visible = defineModel<boolean>({
  required: true,
})

const activeIndex = ref('1')

</script>

<template>
  <el-dialog
    v-model="visible"
    width="70%"
    :close-on-click-modal="false"
  >

    <div
      class="h-[60vh] w-full flex justify-between"
    >
      <Menu
        v-model="activeIndex"
      />

      <div
        class="h-full flex items-center justify-center !flex-1"
      >
        <Info
          v-if="activeIndex === '0'"
        />

        <Read
          v-if="activeIndex === '1'"
        />

      </div>

    </div>

  </el-dialog>
</template>

<style lang="scss" scoped>

</style>
