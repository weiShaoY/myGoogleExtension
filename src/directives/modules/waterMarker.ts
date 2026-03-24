import type { Directive, DirectiveBinding } from 'vue'

// 类型已迁移至 `src/directives/types/index.ts`

/**
 * 全局默认配置
 */
const defaultOptions = {
  textColor: 'rgba(180, 180, 180, 0.3)',
  font: '16px Microsoft JhengHei',
}

/**
 * 添加水印
 * 给整个页面添加背景水印
 */
function addWaterMarker(str: string, parentNode: HTMLElement, font: string, textColor: string) {
  // 创建 canvas 元素
  const can: HTMLCanvasElement = document.createElement('canvas')

  parentNode.appendChild(can)

  // 设置 canvas 尺寸
  can.width = 205
  can.height = 140
  can.style.display = 'none'

  /**
   *  获取 canvas 上下文
   */
  const cans = can.getContext('2d') as CanvasRenderingContext2D

  // 旋转角度
  cans.rotate((-20 * Math.PI) / 180)

  // 设置字体样式
  cans.font = font
  cans.fillStyle = textColor
  cans.textAlign = 'left'
  cans.textBaseline = 'middle'

  // 绘制水印文字
  cans.fillText(str, can.width / 10, can.height / 2)

  // 将 canvas 转换为背景图片
  parentNode.style.backgroundImage = `url(${can.toDataURL('image/png')})`
}

/**
 *  水印指令
 *  @description 用于在绑定元素上添加水印效果
 */
export const waterMarker: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<DirectiveType.WaterMarkerParamsType>) {
    /**
     *  解构参数，并提供默认值
     */
    const { text, font = defaultOptions.font, textColor = defaultOptions.textColor } = binding.value

    // 调用添加水印函数
    addWaterMarker(text, el, font, textColor)
  },
  beforeUnmount(el: HTMLElement) {
    // 清理水印
    el.style.backgroundImage = ''
  },
}
