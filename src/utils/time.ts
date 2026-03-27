/**
 * 计算从指定时间戳到当前时间过去了多久
 * @param timestamp 开始时间戳（毫秒）
 * @returns 格式化字符串：xx时xx分xx秒
 */
export function getElapsedTime(timestamp: number): string {
  const diff = Date.now() - timestamp

  const totalSeconds = Math.floor(diff / 1000)

  const hours = Math.floor(totalSeconds / 3600)

  const minutes = Math.floor((totalSeconds % 3600) / 60)

  const seconds = totalSeconds % 60

  return `${hours}时${minutes}分${seconds}秒`
}

/**
 * 计算两个时间戳之间的耗时
 * @param startTime 开始时间戳（毫秒）
 * @param endTime 结束时间戳（毫秒）
 * @returns 格式化耗时：xx时xx分xx秒
 */
// export function getDuration(startTime: number, endTime: number): string {
//   // 计算时间差（毫秒）
//   const diff = Math.abs(endTime - startTime)

//   // 转为秒
//   const totalSeconds = Math.floor(diff / 1000)

//   // 时分秒
//   const hours = Math.floor(totalSeconds / 3600)

//   const minutes = Math.floor((totalSeconds % 3600) / 60)

//   const seconds = totalSeconds % 60

//   // 返回你要的格式
//   return `${hours}时${minutes}分${seconds}秒`
// }

export function getDuration(startTime: number, endTime: number): string {
  // 计算时间差（毫秒）
  const diff = Math.abs(endTime - startTime)

  // 将毫秒转为秒，保留浮点数以便后续精确计算
  const totalSecondsFloat = diff / 1000

  // 计算小时
  const hours = Math.floor(totalSecondsFloat / 3600)

  // 计算剩余的秒数（去除小时部分）
  const remainingSecondsAfterHours = totalSecondsFloat % 3600

  // 计算分钟
  const minutes = Math.floor(remainingSecondsAfterHours / 60)

  // 计算最终的秒数（去除小时和分钟部分），这部分可能包含小数
  const finalSeconds = remainingSecondsAfterHours % 60

  // 将最终的秒数格式化为保留三位小数的字符串
  const formattedSeconds = finalSeconds.toFixed(3)

  // 返回你要的格式
  return `${hours}时${minutes}分${formattedSeconds}秒`
}
