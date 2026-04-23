<!------  2026-04-23---19:10---星期四  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

const siteStore = useSiteStore()

</script>

<template>
  <div
    class=""
  >
    .img-list {
    column-count: 4;
    column-gap: 12px;
    }

    .img-item {
    width: 100%;
    margin-bottom: 12px;
    break-inside: avoid;
    }

    <el-form>
      <el-form-item
        prop="isWaterfallLayout"
        label="是否开启瀑布流布局"
      >
        <el-switch
          v-model="siteStore.site.javDB.isWaterfallLayout"
          active-value="true"
          inactive-value="false"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>

</style>
