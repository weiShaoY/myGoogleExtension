/**
 * 安全查询单个 DOM 元素
 * @description 封装 document.querySelector，支持泛型指定元素类型
 * @param selectorOrParent CSS 选择器 或 父元素
 * @param selector 可选，CSS 选择器（当第一个参数是父元素时使用）
 * @returns 匹配的 DOM 元素或 null
 */
export function $<T extends HTMLElement = HTMLElement>(
  selectorOrParent: string | Element | null,
  selector?: string,
): T | null {
  // 如果传了两个参数：$(父元素, 选择器)
  if (selector) {
    const parent = selectorOrParent as Element | null

    return parent?.querySelector<T>(selector) ?? null
  }

  // 如果只传一个参数：$(选择器)
  return document.querySelector<T>(selectorOrParent as string)
}

/**
 * 安全查询多个 DOM 元素
 * @description 封装 document.querySelectorAll，支持泛型指定元素类型
 * @param selectorOrParent CSS 选择器 或 父元素
 * @param selector 可选，CSS 选择器（当第一个参数是父元素时使用）
 * @returns 匹配的元素列表
 */
export function $$<T extends HTMLElement = HTMLElement>(
  selectorOrParent: string | Element | null,
  selector?: string,
): NodeListOf<T> {
  if (selector) {
    const parent = selectorOrParent as Element | null

    return parent?.querySelectorAll<T>(selector) ?? document.querySelectorAll<T>(':not(*)')
  }

  return document.querySelectorAll<T>(selectorOrParent as string)
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

/**
 * 【通用封装】在指定 DOM 元素位置安全插入 HTML 字符串
 * @description 自动校验元素是否存在，支持 4 种标准插入位置，默认在元素外部后面插入
 * @param selector 目标元素选择器 / 已获取的 DOM 元素
 * @param html 要插入的 HTML 内容
 * @param position 插入位置，默认：afterend（元素后面）
 * 可选值：beforebegin(前面) / afterbegin(内部前) / beforeend(内部后) / afterend(后面)
 * @returns 是否插入成功
 */
export function insertHtml(
  selector: string | HTMLElement | null,
  html: string,
  position: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend' = 'afterend',
): boolean {
  // 自动处理：传入选择器则获取元素，传入DOM则直接使用
  const el = typeof selector === 'string' ? $(selector) : selector

  if (!el) {
    return false
  }

  el.insertAdjacentHTML(position, html)
  return true
}
