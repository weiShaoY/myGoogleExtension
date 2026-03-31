/**
 * 延迟执行函数
 * @description 封装 setTimeout，简化延迟调用逻辑
 * @param fn 需要延迟执行的函数
 * @param ms 延迟毫秒数
 */
export function delayRun(fn: () => void, ms = 500): void {
  setTimeout(fn, ms)
}
