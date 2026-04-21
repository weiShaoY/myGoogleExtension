<!------  2025-04-21---01:08---星期一  ------>  
<!------------------------------------    ------------------------------------------------->

<script lang="ts" setup>

type Props = {

  /**
   *  菜单项
   */
  menu: any

}

defineProps<Props>()

</script>

<template>
  <div
    class="flex items-center gap-2 text-4"
  >
    <SvgIcon
      v-if="menu.meta?.icon"
      :icon="menu.meta.icon"
      :size="20"
    />

    <div
      class="flex items-center gap-2"
    >
      <span
        class=""
      >
        {{ menu.meta.title }}
      </span>

      <!-- 外链徽标 -->
      <SvgIcon
        v-if="menu.meta.externalUrl"
        icon="admin-menu-externalUrl"
        :size="16"
      />

      <!-- 文本徽标 -->
      <div
        v-else-if="menu.meta.textBadge"
        class="m-auto h-[16px] min-w-5 flex items-center justify-center rounded-[5px] bg-[#fd4e4e] p-x-1 text-center text-[10px] text-white leading-5"
      >
        {{ menu.meta.textBadge }}
      </div>

      <!-- 图标徽标 -->
      <SvgIcon
        v-else-if="menu.meta.iconBadge"
        :icon="menu.meta.iconBadge"
        :size="16"
      />
    </div>
  </div>
</template>
