/**
 * 获取数组中所有重复的项
 * @description 根据指定属性分组，返回出现次数大于 1 的所有项（完整对象）
 * @param list 要进行重复检测的数组
 * @param property 用于判断重复的对象属性名
 * @returns 所有重复项组成的一维数组
 */
export function getDuplicateItems<T>(list: T[], property: keyof T): T[] {
  const groupMap = list.reduce((acc, item) => {
    const key = item[property] as unknown as string

    acc[key] ||= []
    acc[key].push(item)
    return acc
  }, {
  } as Record<string, T[]>)

  return Object.values(groupMap)
    .filter(items => items.length > 1)
    .flat()
}

/**
 * 获取数组中重复项的唯一键名
 * @description 根据指定属性分组，返回存在重复的属性值列表（仅返回 key，不返回对象）
 * @param list 要进行重复检测的数组
 * @param property 用于判断重复的对象属性名
 * @returns 重复项的 key 名称列表
 */
export function getDuplicateItemKeys<T>(list: T[], property: keyof T): string[] {
  const groupMap = list.reduce((acc, item) => {
    const key = item[property] as unknown as string

    acc[key] ||= []
    acc[key].push(item)
    return acc
  }, {
  } as Record<string, T[]>)

  return Object.keys(groupMap).filter(key => groupMap[key].length > 1)
}
