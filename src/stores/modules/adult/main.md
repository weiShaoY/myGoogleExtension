// // const [
// // 'aaa-bbb.mp4',
// // 'aaa-bbb.mp4',
// // 'aaa-BBB.mp4'
// // ]

// // folderDuplicateNameFileList: videoFile[]
// // folderUniqueFileNameFileList: string[]
// 视频列表为
// const [
// 'aaa-bbb.mp4',
// 'aaa-bbb.mp4',
// 'aaa-BBB.mp4',
// 'abc-dfg.mp4',
// 'cnb-dad.mp4',
// 'cnb-dad.mp4',
// 'bde-fgd.mp4',
// ]
// 视频数组是这样的, folderDuplicateNameFileList 代表的是所有重复的 比如结果为 ['aaa-bbb.mp4', 'aaa-bbb.mp4','aaa-BBB.mp4','cnb-dad.mp4','cnb-dad.mp4'] 会转换成小写进行比较 然后所有重复都 进这个数组

// folderUniqueFileNameFileList 这个则是 所有重复的只记录一次, 所以结果为 ['aaa-bbb.mp4', 'cnb-dad.mp4']

// 帮我写下这两个 数组变量的 jsdoc 和中文描述, 怎么描述好
//
