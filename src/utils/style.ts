import type { CSSProperties } from 'vue'

import { twMerge } from 'tailwind-merge'

/**
 * class 统一合并工具
 */
export function mergeClass(
  ...inputs: Array<
    string | Record<string, boolean> | Array<string | Record<string, boolean>> | undefined
  >
): string {
  function stringify(
    input?: string | Record<string, boolean> | Array<any>,
  ): string {
    if (!input) {
      return ''
    }

    if (typeof input === 'string') {
      return input
    }

    if (Array.isArray(input)) {
      return input.map(stringify)
        .filter(Boolean)
        .join(' ')
    }

    return Object.entries(input)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .join(' ')
  }

  return twMerge(...inputs.map(stringify))
}

/**
 * style 合并工具
 */
export function mergeStyle(
  base: CSSProperties = {
  },
  extra?: CSSProperties,
): CSSProperties {
  return {
    ...base,
    ...extra,
  }
}
