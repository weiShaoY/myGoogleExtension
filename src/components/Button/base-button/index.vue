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
 * 组件属性类型
 */
type Props = {

  /** 按钮的 class 类名 */
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>

  /** 图标名称 */
  icon?: string

  /** 图标大小 */
  size?: number

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
   *  是否悬浮旋转
   */
  /**
   *  是否悬浮旋转
   */
  rotate?: boolean
}

/**
 * 默认按钮类
 */
const DEFAULT_CLASS = 'flex items-center justify-center '

/**
 * 处理 class，兼容多种格式
 * @param input - 输入的类
 * @returns 拼接后的类字符串
 */
function stringifyClass(input?: string | Record<string, boolean> | Array<string | Record<string, boolean>>): string {
  if (!input) {
    return ''
  }

  if (typeof input === 'string') {
    return input
  }

  if (Array.isArray(input)) {
    return input
      .map(item => stringifyClass(item))
      .filter(Boolean)
      .join(' ')
  }

  return Object.entries(input)
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(' ')
}

/**
 * 计算按钮的最终类名
 */
const computedButtonClass = computed(() => twMerge(DEFAULT_CLASS, stringifyClass(props.class)))

/**
 * 计算图标的最终类名（包含旋转效果）
 */
const computedIconClass = computed(() => {
  const baseClass = stringifyClass(props.iconClass)

  const rotateClass = props.rotate ? 'hover:rotate-180 hover:transition-transform hover:duration-1000' : ''

  return twMerge(baseClass, rotateClass)
})

/**
 * 计算按钮的行内样式
 */
const computedStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
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
                :size="size - 14"
                :class="computedIconClass"
              />
            </slot>
          </template>

          <template
            v-else
          >
            <IconLoading
              :size="size - 14"
            />
          </template>
        </div>
      </el-button>
    </el-tooltip>
  </div>
</template>
