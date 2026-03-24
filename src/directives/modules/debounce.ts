import type { Directive, DirectiveBinding } from 'vue'

// 类型已迁移至 `src/directives/types/index.ts`

type ElType = {
  __handleClick__: () => any
} & HTMLElement

/**
 *  防抖指令
 *  @description 防抖指令，用于防止按钮重复点击
 */
const debounce: Directive = {
  mounted(el: ElType, binding: DirectiveBinding<DirectiveType.DebounceParamsType>) {
    const { delay = 500, handler } = binding.value

    if (typeof handler !== 'function') {
      throw new TypeError('handler 必须是一个函数')
    }

    let timer: NodeJS.Timeout | null = null

    el.__handleClick__ = function () {
      if (timer) {
        clearTimeout(timer)
      }

      timer = setTimeout(() => {
        handler()
      }, delay)
    }

    el.addEventListener('click', el.__handleClick__)
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el.__handleClick__)
  },
}

export default debounce
