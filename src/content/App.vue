<!------  2026-03-24---13:14---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

import Pages from './pages/index.vue'

import Search from './search/index.vue'

const testStore = useTestStore()

function testValueClick() {
  testStore.testValue++
}

function testObjClick() {
  testStore.testObj.a++
}

onMounted(() => {
  // window.$message({
  //   message: '显示搜索框',
  //   duration: 113000,
  //   type: 'success',
  // })

})
</script>

<template>

  <AppProvider>
    <Search />

    <Pages />

  </AppProvider>

  <div
    class="fixed bottom-60 right-10 flex flex-col items-center gap-3"
  >

    <div
      class="flex items-center justify-center gap-3"
    >
      <div
        class="h-full w-30 flex items-center justify-center bg-red"
      >
        {{ testStore.testValue }}

      </div>

      <el-button
        class=""
        @click="testValueClick"
      >
        测试 单个值
      </el-button>

    </div>

    <div
      class="flex items-center justify-center gap-3"
    >
      <div
        class="h-full w-30 flex items-center justify-center bg-emerald"
      >
        {{ testStore.testObj }}

      </div>

      <el-button
        class=""
        @click="testObjClick"
      >
        测试 对象
      </el-button>
    </div>

    <div
      v-copy="{
        text: '3333333333333333',
      }"
      class="mt-20 h-20 w-20 bg-red"
    >
      测试指令

    </div>
  </div>

</template>

<style lang="scss" scoped>

</style>
