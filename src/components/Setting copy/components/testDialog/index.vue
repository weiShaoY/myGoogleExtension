<!------  2026-03-27---00:44---星期五  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
const visible = defineModel<boolean>({
  required: true,
})

</script>

<template>
  <el-dialog
    v-model="visible"
    width="50%"
    :close-on-click-modal="false"
  >
    测试
  </el-dialog>
</template>

<style lang="scss" scoped>

</style>
