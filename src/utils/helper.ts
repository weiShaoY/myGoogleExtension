/**
 * 清洗视频名称：小写 + 去空格
 */
export function cleanVideoName(name: string | null | undefined): string {
  if (!name) {
    return ''
  }

  return name.trim()
    .toLowerCase()
    .replace(/\s+/g, '')
}

/**
 * 安全查询单个元素
 */
export function $<T extends HTMLElement = HTMLElement>(
  selector: string,
): T | null {
  return document.querySelector<T>(selector)
}

/**
 * 安全查询多个元素
 */
export function $$<T extends HTMLElement = HTMLElement>(
  selector: string,
): NodeListOf<T> {
  return document.querySelectorAll<T>(selector)
}

/**
 * 工具：把 Element 转为 HTMLElement
 */
export function asHTMLElement(el: Element | null): HTMLElement | null {
  return el as HTMLElement | null
}

/**
 * 添加 class 并 push 到列表（防重复）
 */
export function addClassAndPush<T>(
  el: HTMLElement | null | undefined,
  className: string,
  list: T[],
  value: T,
): void {
  if (!el || el.classList.contains(className)) {
    return
  }

  el.classList.add(className)
  list.push(value)
}

/**
 * 延迟执行
 */
export function delayRun(fn: () => void, ms = 500): void {
  setTimeout(fn, ms)
}
