<!------------------------------------  基础图标按钮  ------------------------------------------------->
<script setup lang="ts">
import type { Placement } from 'element-plus'

import type { CSSProperties } from 'vue'

import { parseSize, subtractSize } from '@/utils/size'

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
 */
const ICON_SIZE_OFFSET = 10

/**
 * 组件属性类型
 */
type Props = {

  /** 按钮的 class 类名 */
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>

  /** 图标名称 */
  icon?: string

  /** 文本内容 */
  text?: string

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

  /** 是否悬浮旋转 */
  rotate?: boolean
}

/**
 * 默认按钮样式（接近 el-button）
 */
const DEFAULT_BUTTON_CLASS = [
  'inline-flex items-center justify-center',
  'rounded-2',
  'border border-solid border-[#dcdfe6]',
  'bg-white',

  // hover
  'hover:color-primary hover:shadow-sm hover:border-primary hover:bg-[#ecf5ff]',

  // active
  'active:scale-[0.97]',

  // 动画
  'transition-all duration-200',

  // 交互
  'cursor-pointer select-none',
]

/**
 * 是否有文本
 */
const hasText = computed(() => !!props.text)

/**
 * 容器尺寸
 */
const computedSize = computed(() => parseSize(props.size))

/**
 * 图标尺寸
 */
const computedIconSize = computed(() =>
  subtractSize(props.size, ICON_SIZE_OFFSET),
)

/**
 * 按钮 class
 */
const computedButtonClass = computed(() =>
  mergeClass(DEFAULT_BUTTON_CLASS, props.class),
)

/**
 * 图标 class
 */
const computedIconClass = computed(() => {
  const rotateClass = props.rotate
    ? 'hover:rotate-180 hover:transition-transform hover:duration-1000'
    : ''

  return mergeClass(props.iconClass, rotateClass)
})

/**
 * 行内样式
 * 👉 有 text → 宽度自适应
 * 👉 无 text → 固定正方形
 */
const computedStyle = computed(() => {
  const base: CSSProperties = {
    height: computedSize.value,
    padding: `${ICON_SIZE_OFFSET / 4}px`,
  }

  if (!hasText.value) {
    base.width = computedSize.value
  }

  return mergeStyle(base, props.style)
})
</script>

<template>
  <el-tooltip
    :placement="tooltipPlacement"
    :content="tooltipContent"
    :z-index="zIndex"
    :disabled="!tooltipContent"
  >
    <div
      :class="computedButtonClass"
      :style="computedStyle"
      @click="$emit('click', $event)"
    >
      <!-- loading 优先 -->
      <template
        v-if="loading"
      >
        <IconLoading
          :size="computedIconSize"
        />
      </template>

      <template
        v-else
      >
        <slot>
          <!-- icon -->
          <SvgIcon
            v-if="icon"
            :icon="icon"
            :size="computedIconSize"
            :class="computedIconClass"
          />
        </slot>

        <!-- text -->
        <span
          v-if="text"
          :class="mergeClass('text-4 font-bold', icon && 'ml-3')"
        >
          {{ text }}
        </span>
      </template>
    </div>
  </el-tooltip>
</template>

<style scoped lang="scss">
</style>
