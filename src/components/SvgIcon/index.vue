<script setup lang="ts">
import type { CSSProperties } from 'vue'

import { twMerge } from 'tailwind-merge'

/**
 * SVG 图标组件属性类型
 */
type SvgIconPropsType = {

  /** 图标的名称 */
  icon: string

  /** 图标的前缀 */
  prefix?: string

  /** 图标的颜色 */
  color?: string

  /** 图标的大小 */
  size?: string | number

  /** 额外的 CSS 类名 */
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>

  /** 行内样式 */
  style?: CSSProperties

  /** 图标的描述文本 */
  description?: string

  /** 是否禁用 */
  disabled?: boolean
}

/**
 * 组件属性默认值
 */
const props = withDefaults(defineProps<SvgIconPropsType>(), {
  prefix: 'icon',
  size: 24,
  color: 'currentColor',
  description: '',
  disabled: false,
})

/**
 * 基础类名
 */
const BASE_CLASSES = 'anticon fill-current inline-block h-[1em] w-[1em] overflow-hidden outline-none'

/**
 * 计算 `symbolId` 用于引用图标
 */
const symbolId = computed(() => `#${props.prefix}-${props.icon}`)

/**
 * 处理类名，将不同类型的类名转换为字符串
 */
function stringifyClass(input: string | Record<string, boolean> | Array<string | Record<string, boolean>>): string {
  if (typeof input === 'string') {
    return input
  }

  if (Array.isArray(input)) {
    return input.map(item => stringifyClass(item)).join(' ')
  }

  return Object.entries(input)
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(' ')
}

/**
 * 计算合并后的类名
 */
const computedClass = computed(() => {
  const classes = [BASE_CLASSES]

  if (props.disabled) {
    classes.push('opacity-50 cursor-not-allowed')
  }

  if (props.class) {
    const classString = stringifyClass(props.class)

    return twMerge(...classes, classString)
  }

  return classes.join(' ')
})

/**
 * 计算 SVG 的行内样式
 */
const computedStyle = computed(() => ({
  verticalAlign: 'middle',
  width: props.size,
  height: props.size,
  color: props.color,
  ...props.style,
}))

/**
 * 计算图标的描述文本
 */
const ariaLabel = computed(() => props.description || props.icon)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    :aria-label="ariaLabel"
    :aria-disabled="disabled"
    :class="computedClass"
    :style="computedStyle"
    role="img"
  >
    <title>{{ ariaLabel }}</title>

    <use
      :xlink:href="symbolId"
      fill="currentColor"
    />
  </svg>
</template>
