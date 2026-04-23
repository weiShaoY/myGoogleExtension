<!------------------------------------  基础图标按钮  ------------------------------------------------->
<script setup lang="ts">
import type { Placement } from 'element-plus'

import type { CSSProperties } from 'vue'

import { parseSize, subtractSize } from '@/utils/size'

const props = withDefaults(defineProps<Props>(), {
  class: '',
  icon: '',
  size: 40,
  iconSize: undefined, // ✅ 关键：默认不传才走自动计算
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

  /** 按钮尺寸 */
  size?: number | string

  /** 图标尺寸（优先级更高） */
  iconSize?: number | string

  /** 图标额外的 class */
  iconClass?: string | Record<string, boolean> | Array<string | Record<string, boolean>>

  /** 提示框内容 */
  tooltipContent?: string

  /** 提示框位置 */
  tooltipPlacement?: Placement

  /** 层级 */
  zIndex?: number

  /** 行内样式 */
  style?: CSSProperties

  /** 是否 loading */
  loading?: boolean

  /** 是否悬浮旋转 */
  rotate?: boolean
}

/**
 * 默认按钮样式
 */
const DEFAULT_BUTTON_CLASS = [
  'flex items-center justify-center',
  'box-border',
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
 * 按钮尺寸
 */
const computedSize = computed(() => parseSize(props.size))

/**
 * 图标尺寸（支持覆盖）
 */
const computedIconSize = computed(() => {
  const { iconSize, size } = props

  return iconSize != null
    ? parseSize(iconSize)
    : subtractSize(size, ICON_SIZE_OFFSET)
})

/**
 * 按钮 class（不再用 mergeClass，避免坑）
 */
const computedButtonClass = computed(() => [
  DEFAULT_BUTTON_CLASS,
  props.class,
])

/**
 * 图标 class
 */
const computedIconClass = computed(() => {
  const rotateClass = props.rotate
    ? 'hover:rotate-180 hover:transition-transform hover:duration-1000'
    : undefined

  const list = []

  if (props.iconClass) {
    if (Array.isArray(props.iconClass)) {
      list.push(...props.iconClass)
    }
    else {
      list.push(props.iconClass)
    }
  }

  if (rotateClass) {
    list.push(rotateClass)
  }

  return list
})

/**
 * 行内样式
 */
const computedStyle = computed(() => {
  const base: CSSProperties = {
    height: computedSize.value,
    padding: `${ICON_SIZE_OFFSET / 4}px`,
  }

  if (!hasText.value) {
    base.width = computedSize.value
  }

  return Object.assign(base, props.style)
})
</script>

<template>
  <!-- ✅ 最外层 = 按钮（承载 fixed / absolute） -->
  <div
    :class="computedButtonClass"
    :style="computedStyle"
    @click="$emit('click', $event)"
  >
    <!-- ✅ tooltip 只包内容 -->
    <el-tooltip
      :placement="tooltipPlacement"
      :content="tooltipContent"
      :z-index="zIndex"
      :disabled="!tooltipContent"
    >
      <div
        class="h-full w-full flex items-center justify-center"
      >
        <!-- loading -->
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
            class="text-4 font-bold"
            :class="icon && 'ml-3'"
          >
            {{ text }}
          </span>
        </template>
      </div>
    </el-tooltip>
  </div>
</template>

<style scoped lang="scss">
</style>
