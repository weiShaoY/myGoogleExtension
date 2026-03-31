// import { AdultConfig } from '@/configs'

/**
 * 获取视频标签图标数组
 * @param  fullName - 视频完整名称（包含扩展名）
 * @returns  标签图标数组，如果未找到匹配的标签，则返回空数组
 */
// export function getFileTagIconArray(fullName: string): string[] {
//   // 使用正则表达式 config.video.tagExtractionRegex 在 fullName 中查找所有匹配项

//   const foundTags = [...fullName.matchAll(AdultConfig.videoFileMatch.videoFileTagExtractionRegex)]

//   if (foundTags.length > 0) {
//     // 从 tagConfigs 中找到匹配的标签对象，并提取 icon 值
//     const matchingIcons = AdultConfig.videoFileMatch.videoFileTags
//       .filter(tag =>

//         // 检查 tag.names 数组中的任何一个项是否存在于 foundTags 中
//         tag.names.some(n =>
//           foundTags.some(match => match[0].toLowerCase().includes(n.toLowerCase())),
//         ),
//       )
//       .map(tag => tag.icon) // 只返回 icon 值

//     // 返回匹配的图标数组
//     return matchingIcons
//   }
//   else {
//     // 如果没有找到匹配的标签，则返回空数组
//     return []
//   }
// }
