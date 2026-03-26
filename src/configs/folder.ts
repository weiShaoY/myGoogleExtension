/**
 *  标签配置
 */
const fileTagConfigs = [
  {
    names: ['4K'],
    icon: 'tag-4k',
  },
  {
    names: ['-c', '-C', '_ch', '-UC'],
    icon: 'tag-ziMu',
  },
  {
    names: ['无码'],
    icon: 'tag-wuMa',
  },
  {
    names: ['破解'],
    icon: 'tag-poJie',
  },
  {
    names: ['流出'],
    icon: 'tag-liuChu',
  },
]

/**
 *  文件夹配置
 */
export const folderConfig: FolderConfigType.FileProcessing = {
  fileExtensions: ['mp4', 'mkv', 'avi', 'flv', 'wmv', 'mov', 'rmvb'],

  fileTagConfigs,

  fileTagExtractionRegex: new RegExp(
    fileTagConfigs
      .flatMap(tag => tag.names)
      .map(name => name.includes('-')

        ? name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

        : `-?${name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`,
      )
      .join('|'),
    'gi',
  ),
}
