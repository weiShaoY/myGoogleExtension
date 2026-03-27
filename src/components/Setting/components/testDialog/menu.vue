<!------  2026-03-27---00:56---星期五  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
const activeIndex = defineModel<string>({
  required: true,
})

function handleSelect(key: string, keyPath: string[]) {
  console.log('🚀 ~ file: menu.vue:7 ~ keyPath:', keyPath)
  console.log('🚀 ~ file: menu.vue:7 ~ key:', key)
  activeIndex.value = key
}
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="h-full w-[10vw]"
    @select="handleSelect"
  >
    <el-menu-item
      index="0"
    >
      <SvgIcon
        icon="info"
        class="mr-3"
      />

      <span>信息</span>
    </el-menu-item>

    <el-menu-item
      index="1"
    >
      <SvgIcon
        icon="folder"
        class="mr-3"
      />

      <span>读取</span>
    </el-menu-item>

    <el-menu-item
      index="2"
    >
      <SvgIcon
        icon="queryDuplicate"
        class="mr-3"
      />

      <span>查重</span>
    </el-menu-item>

    <el-menu-item
      index="3"
    >
      <span>Navigator Four</span>
    </el-menu-item>
  </el-menu>
</template>

<style lang="scss" scoped>
:deep(.is-active) {
  background-color: #eef3ff !important;
}
</style>
