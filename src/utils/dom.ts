/**
 * 安全查询单个 DOM 元素
 * @description 封装 document.querySelector，支持泛型指定元素类型
 * @param selector CSS 选择器
 * @returns 匹配的 DOM 元素或 null
 */
export function $<T extends HTMLElement = HTMLElement>(
  selector: string,
): T | null {
  return document.querySelector<T>(selector)
}

/**
 * 安全查询多个 DOM 元素
 * @description 封装 document.querySelectorAll，支持泛型指定元素类型
 * @param selector CSS 选择器
 * @returns 匹配的元素列表
 */
export function $$<T extends HTMLElement = HTMLElement>(
  selector: string,
): NodeListOf<T> {
  return document.querySelectorAll<T>(selector)
}

/**
 * 类型转换为 HTMLElement
 * @description 将 Element 类型安全转换为 HTMLElement，方便操作样式/类名
 * @param el 原始元素
 * @returns 转换后的 HTMLElement 或 null
 */
export function asHTMLElement(el: Element | null): HTMLElement | null {
  return el as HTMLElement | null
}

/**
 * 添加样式类并向数组添加数据
 * @description 仅当元素存在且未包含指定类时，执行添加类名和推入数组操作
 * @param el 目标 DOM 元素
 * @param className 要添加的类名
 * @param list 要推入的数组
 * @param value 要添加到数组的值
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
 * 阻止事件的所有默认行为与传播
 * @description 阻止冒泡、阻止同级监听、阻止默认行为并返回 false
 * @param event 事件对象
 * @returns false
 */
export function preventEvent(event: Event): boolean {
  event.stopPropagation()
  event.stopImmediatePropagation()
  event.preventDefault()
  return false
}

/**
 * 判断是否为有效 HTML 元素
 * @description 用于 DOM 操作前的安全校验，确保元素存在且是 HTMLElement
 * @param element 待校验的值
 * @returns 校验结果
 */
export function isElementExists(element: any): element is HTMLElement {
  return !!element && element instanceof HTMLElement
}
