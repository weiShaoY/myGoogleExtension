// 一个视频文件, 他的名称为 IPZZ-105-C-破解.mp4
//          这个 -c 这种标签代表 字幕 还有类似的 -破解 这种
// 我有一个标签数组one来匹配这些标签 比如 ['-c','-破解','-中文字幕',['-c','-4k']]

// 我的想你帮我起几个变量名

// 其中 a变量代表 完整 视频名称  : IPZZ-105-C-破解.mp4
//     b变量代表去除 掉文件拓展名的:比如 IPZZ-105-C-破解
//     c变量代表 去除掉标签以后 : IPZZ-105
//     d变量代表 匹配到的标签数组 : ['-c', '-破解']
//     e变量表示 文件的拓展名 : .mp4
//     f变量表示 文件是否包含中文字幕 :  如果 文件名中 含有 -c 或者 -C 或者 -中文 或者 -中文字幕 则为 true
//     g变量表示 文件在系统中的完整位置 比如  Z:\日本-有码\明里つむぎ\IPZZ-105-破解-C 明里つむぎ\IPZZ-105-破解-C.mp4
//     h变量表示 文件大小 比如 2.45 GB

//     i变量表示 文件分辨率 比如 1080p

//     j变量表示 文件的唯一值 比如 1234567890

/**
 * 完整文件名（包含扩展名）
 * @type {string}
 */
// const fullFileName = 'IPZZ-105-C-破解.mp4'

// /**
//  * 去掉扩展名的文件名
//  * @type {string}
//  */
// const baseFileName = 'IPZZ-105-C-破解'

// /**
//  * 去掉标签后的纯视频编号
//  * @type {string}
//  */
// const pureVideoCode = 'IPZZ-105'

// /**
//  * 匹配到的标签列表
//  * @type {string[]}
//  */
// const matchedTagList = ['-c', '-破解']

// /**
//  * 文件扩展名
//  * @type {string}
//  */
// const fileExtension = '.mp4'

// /**
//  * 是否包含中文字幕
//  * @type {boolean}
//  */
// const hasChineseSubtitle = true

// /**
//  * 文件完整路径
//  * @type {string}
//  */
// const fileFullPath = 'Z:\\日本-有码\\明里つむぎ\\IPZZ-105-破解-C 明里つむぎ\\IPZZ-105-破解-C.mp4'

// /**
//  * 文件大小（字符串或格式化后的）
//  * @type {string}
//  */
// const fileSizeText = '2.45 GB'

// /**
//  * 视频分辨率
//  * @type {string}
//  */
// const videoResolution = '1080p'

// /**
//  * 文件唯一标识（hash 或 id）
//  * @type {string | number}
//  */
// const fileUniqueId = '1234567890'

//  豆包

// // a 完整文件名（含扩展名+所有标签）
// const fullName

// // b 去掉扩展名的名称
// const baseName

// // c 去掉所有标签后的纯净番号/核心名
// const cleanName

// // d 从文件名匹配到的标签数组
// const matchedTags

// // e 文件扩展名
// const ext

// // f 是否含中文字幕
// const hasChineseSub

// // g 文件完整路径
// const filePath

// // h 文件大小（格式化后）
// const fileSize

// // i 分辨率
// const resolution

// // j 唯一标识
// const fileId
