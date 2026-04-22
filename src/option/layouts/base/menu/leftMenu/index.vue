<!------  2026-04-06---04:23---星期一  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

type PropsType = {

  /** 路由列表 */
  menuList: RouterType.Route[]
}
const { menuList } = defineProps<PropsType>()

const emits = defineEmits<{

  /**
   * 博客菜单跳转事件
   * @param menu 菜单项
   * @param jumpToFirst 是否跳转到第一个子菜单
   */
  menuJump: [menu: RouterType.Route, jumpToFirst: boolean]
}>()

/**
 *  是否显示菜单文字
 */
const dualMenuShowText = ref(true)

const route = useRoute()

/**
 * 当前路由对应的第一级菜单项
 */
const currentRoute = computed<RouterType.Route | undefined>(() => {
  return findTopRouteByPath(route.path, menuList)
})

console.log('🚀 ~ file: index.vue:37 ~ currentRoute:', currentRoute.value)

/**
   *  刷新
   */
function refresh() {
  window.location.reload()
}
</script>

<template>
  <!-- 左侧菜单 -->
  <div
    class="relative h-full w-20 border-r-2 border-solid !border-[#eeeeee]"
    :style="{
      width: '80px',
    }"
  >
    <div
      class="aspect-square w-full flex items-center justify-center"
    >
      <SvgIcon
        icon="logo"
        :size="40"
      />

    </div>

    <el-scrollbar
      class="h-full"
    >
      <div
        v-for="menu in menuList"
        :key="menu.path"
        class="mb-3 flex items-center justify-center"
        @click="emits('menuJump', menu, true)"
      >
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="menu.meta.title"
          placement="right"
          :offset="25"
          :hide-after="0"
          :disabled="dualMenuShowText"
        >
          <div
            class="aspect-square flex flex-col items-center justify-center rounded-md text-center transition-all duration-300 hover:cursor-pointer"
            :class="[
              currentRoute?.path === menu.path ? 'bg-[#eef3ff] text-primary' : '',
              dualMenuShowText ? 'w-[80%]' : 'w-[70%]',
            ]"
          >
            <SvgIcon
              v-if="menu.meta.icon"
              :icon="menu.meta.icon"
              :class="dualMenuShowText ? 'mb-1' : 'scale-130'"
            />

            <span
              v-if="dualMenuShowText"
              class="max-w-[90%] text-ellipsis"
            >
              {{ menu.meta.title }}
            </span>
          </div>
        </el-tooltip>
      </div>
    </el-scrollbar>

    <div
      class="absolute bottom-30 left-0 right-0 flex items-center justify-center hover:cursor-pointer"
      @click="refresh"
    >
      <SvgIcon
        icon="option-menu-refresh"
      />
    </div>

    <BaseButton
      class="absolute left-0 right-0"
      icon="option-menu-refresh"
      @click="refresh"
    />

    <!-- 菜单收缩/展开按钮 -->
    <div
      class="absolute bottom-10 left-0 right-0 flex items-center justify-center hover:cursor-pointer"
      @click="dualMenuShowText = !dualMenuShowText"
    >
      <SvgIcon
        icon="option-menu-switch"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
