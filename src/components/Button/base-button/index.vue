<!------------------------------------  基础图标按钮  ------------------------------------------------->
<script setup lang="ts">
import type { Placement } from 'element-plus'

import type { CSSProperties } from 'vue'

import { twMerge } from 'tailwind-merge'

const props = withDefaults(defineProps<Props>(), {
  class: '',
  icon: '',
  size: 40,
  tooltipContent: '',
  tooltipPlacement: 'bottom',
  loading: false,
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

/**
 * 图标尺寸偏移量
 * 👉 用于按钮 size → icon size 的安全间距
 */
const ICON_SIZE_OFFSET = 14

/**
 * 组件属性类型
 */
type Props = {

  /** 按钮的 class 类名 */
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>

  /** 图标名称 */
  icon?: string

  /** 图标大小 */
  size?: number | string

  /** 图标额外的 class */
  iconClass?: string | Record<string, boolean> | Array<string | Record<string, boolean>>

  /** 提示框内容 */
  tooltipContent?: string

  /** 提示框位置 */
  tooltipPlacement?: Placement

  /** 层级 z-index */
  zIndex?: number

  /** 行内样式 */
  style?: CSSProperties

  /** 是否显示加载中 */
  loading?: boolean

  /**
   * 是否悬浮旋转
   */
  rotate?: boolean
}

const DEFAULT_CLASS = 'flex items-center justify-center'

function stringifyClass(
  input?: string | Record<string, boolean> | Array<string | Record<string, boolean>>,
): string {
  if (!input) {
    return ''
  }

  if (typeof input === 'string') {
    return input
  }

  if (Array.isArray(input)) {
    return input.map(stringifyClass)
      .filter(Boolean)
      .join(' ')
  }

  return Object.entries(input)
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join(' ')
}

const computedButtonClass = computed(() =>
  twMerge(DEFAULT_CLASS, stringifyClass(props.class)),
)

const computedIconClass = computed(() => {
  const base = stringifyClass(props.iconClass)

  const rotate = props.rotate
    ? 'hover:rotate-180 hover:transition-transform hover:duration-1000'
    : ''

  return twMerge(base, rotate)
})

const computedSize = computed(() => parseSize(props.size))

const computedIconSize = computed(() =>
  subtractSize(props.size, ICON_SIZE_OFFSET),
)

const computedStyle = computed(() => ({
  width: computedSize.value,
  height: computedSize.value,
  ...props.style,
}))
</script>

<template>
  <div>
    <el-tooltip
      :placement="tooltipPlacement"
      :content="tooltipContent"
      :z-index="zIndex"
      :disabled="!tooltipContent"
    >
      <el-button
        text
        quaternary
        class="!h-auto !rounded-lg !p-0"
        @click="$emit('click', $event)"
      >
        <div
          :class="computedButtonClass"
          :style="computedStyle"
        >
          <template
            v-if="!loading"
          >
            <slot>
              <SvgIcon
                :icon="icon"
                :size="computedIconSize"
                :class="computedIconClass"
              />
            </slot>
          </template>

          <template
            v-else
          >
            <IconLoading
              :size="computedIconSize"
            />
          </template>
        </div>
      </el-button>
    </el-tooltip>
  </div>
</template>

<style scoped lang="scss">
</style>
