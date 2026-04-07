<!------  2026-04-06---04:23---星期一  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
type PropsType = {
  menuList: MenuItem[]

  currentIndex: string
}
const { menuList } = defineProps<PropsType>()

const emits = defineEmits<{

  /**
   * 博客菜单跳转事件
   * @param menu 菜单项
   * @param jumpToFirst 是否跳转到第一个子菜单
   */
  menuJump: [menu: MenuItem, jumpToFirst: boolean]
}>()

/**
 *  是否显示菜单文字
 */
const dualMenuShowText = ref(false)
</script>

<template>

  <!-- 左侧菜单 -->
  <div
    class="h-full w-20 border border-r-[1px] border-[#EAECF1] !relative"
  >
    <el-scrollbar
      class="h-full"
    >
      <div
        v-for="menu in menuList"
        :key="menu.index"
        class="mb-3 box-border flex items-center justify-center"
        @click="emits('menuJump', menu, true)"
      >
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="menu.title"
          placement="right"
          :offset="25"
          :hide-after="0"
          :disabled="dualMenuShowText"
        >
          <div
            class="aspect-square flex flex-col items-center justify-center rounded-2 text-center transition-all duration-300 hover:cursor-pointer"
            :class="[
              currentIndex === menu.index ? 'bg-[#F3B03D] color-white' : '',
              dualMenuShowText ? 'w-[80%]' : 'w-[70%]',
            ]"
          >
            <SvgIcon
              v-if="menu.icon"
              :icon="menu.icon"
              :class="dualMenuShowText ? 'mb-1 ' : 'scale-130'"
            />

            <span
              v-if="dualMenuShowText"
              class="max-w-[90%] text-ellipsis"
            >
              {{ menu.title }}
            </span>
          </div>
        </el-tooltip>
      </div>
    </el-scrollbar>

    <div
      class="absolute bottom-13 left-0 right-0 flex items-center justify-center !absolute hover:cursor-pointer"
      @click="dualMenuShowText = !dualMenuShowText"
    >
      <SvgIcon
        icon="option-menu-emby"
      />
    </div>

  </div>
</template>
