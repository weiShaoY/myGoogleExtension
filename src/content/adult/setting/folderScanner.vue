<!------  2026-03-27---01:40---星期五  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

import { folderConfig } from '@/configs'

const isLoading = defineModel<boolean>('isLoading', { // 注意这里对应 v-model:is-loading
  default: false,
})

const folderStore = useFolderStore()

/**
 *  表示文件数据的类型
 */
type FileData = {

  /**
   *  文件的句柄，用于访问文件内容
   */
  fileHandle: FileSystemFileHandle

  /**
   *  文件所在的目录名数组，包含层级关系
   */
  directoryPath: string[]

  /**
   *  父目录的句柄，用于访问父目录的内容
   */
  parentDirectoryHandle: FileSystemDirectoryHandle

  /**
   *  nfo 文件内容
   */
  nfoContent: string
}

/**
 * 视频文件集
 */
const videoFileSet: Set<FolderConfigType.File> = new Set([])

/**
 *  主按钮点击事件
 */
async function mainBtnHandler() {
  // 清空存储视频文件信息的 Set
  videoFileSet.clear()

  try {
    // 使用 showDirectoryPicker API 打开目录选择器，让用户选择一个目录
    const directoryHandle: FileSystemDirectoryHandle = await (
      window as any
    ).showDirectoryPicker()

    // 如果用户没有选择目录，显示错误通知并退出函数
    if (!directoryHandle) {
      window.$notification.error({
        title: `请选择一个文件夹`,
        duration: 300000,
      })
      return
    }

    isLoading.value = true

    /**
     *  开始时间
     */
    const startTime = Date.now()

    /**
     * 递归获取目录下的所有文件
     * @param  directoryHandle - 当前目录句柄
     * @param  directoryPath - 目录名数组
     * @returns {AsyncGenerator<FileData>} 异步生成器，生成每个文件的数据
     */
    async function* getFiles(
      directoryHandle: any,
      directoryPath: string[] = [],
    ): AsyncGenerator<FileData> {
      for await (const entry of directoryHandle.entries()) {
        const [name, handle] = entry

        try {
          //   判断当前条目是否为文件，并且文件扩展名是否在 config.video.supportedExtensions 中
          if (
            handle.kind === 'file'
            && folderConfig.fileExtensions.some(ext => name.endsWith(`.${ext}`))
          ) {
            let nfoContent = ''

            // 尝试查找同级目录下的同名 .nfo 文件
            const baseName = name.substring(0, name.lastIndexOf('.'))

            const nfoHandle = await directoryHandle
              .getFileHandle(`${baseName}.nfo`, {
                create: false,
              })
              .catch(() => null)

            if (nfoHandle) {
              const file = await nfoHandle.getFile()

              nfoContent = await file.text()
            }

            // 生成一个包含文件数据的对象
            yield {
              fileHandle: handle,
              directoryPath: [...directoryPath],
              parentDirectoryHandle: directoryHandle,
              nfoContent,
            }
          }

          // 如果当前条目为目录，递归调用 getFiles 函数获取目录下的所有文件
          else if (handle.kind === 'directory') {
            yield* getFiles(handle, [...directoryPath, name])
          }
        }
        catch (e) {
          console.error(e)
        }
      }
    }

    // 使用 for-await-of 语法异步遍历用户选择的目录中的所有文件
    for await (const fileData of getFiles(directoryHandle, [
      directoryHandle.name,
    ])) {
      /**
       *  通过句柄获取文件的 File 对象
       */
      const file = await fileData.fileHandle.getFile()

      /**
       *  解析后的Nfo文件内容
       */
      const nfoContent = parseNfoContent(fileData.nfoContent)

      // 创建一个包含视频信息的对象
      const item: FolderConfigType.File = {
        size: `${(file.size / 1024 ** 3).toFixed(2)} GB`,

        nameWithTags: file.name.substring(0, file.name.lastIndexOf('.')),

        originalName: file.name,

        cleanName: file.name
          .substring(0, file.name.lastIndexOf('.'))
          .toLowerCase()
          .replace(folderConfig.fileTagExtractionRegex, ''),

        extension: file.name.replace(/^.*\./, ''),

        directoryPath: [...fileData.directoryPath, file.name],

        tags: getFileTagIconArray(
          file.name.substring(0, file.name.lastIndexOf('.')),
        ),

        resolution: nfoContent.resolution || '',

        hasChineseSubtitles:
          file.name.includes('-c')
          || file.name.includes('-C')
          || file.name.includes('_ch'),

        id: getRandomNumber(),

      }

      // 将该视频信息对象添加到 Set 中
      videoFileSet.add(item)
    }

    // 将 Set 中的视频文件信息存储到本地
    folderStore.saveEmbyFolderData(directoryHandle.name, videoFileSet, startTime)

    console.log(
      '%c Line:211 🥒 folderStore.folderFileList',
      'color:#465975',
      folderStore.embyFolder.folderFileList,
    )

    window.$notification.success({
      // title: `扫描完成，共扫描到 ${videoFileSet.size} 个文件`,
      title: `${directoryHandle.name} 扫描完成`,
      message: `共扫描到 ${videoFileSet.size} 个文件`,
      duration: 300000,
    })

    isLoading.value = false
  }
  catch (error) {
    console.error('错误:', error)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>

  <div
    class="group relative h-[calc(90px*1.7)] min-w-[230px] w-[20%] flex flex-col items-center justify-end rounded-[15px] bg-[linear-gradient(135deg,#6acf63,#52b44b)] p-[10px] shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
  >

    <div
      class="absolute left-[calc(50%-60px)] top-[-20px] animate-[float_2.5s_infinite_ease-in-out] transition-transform duration-350 ease-in-out group-hover:scale-105"
    >

      <div
        class="absolute h-[80px] w-[120px] rounded-[10px] bg-[linear-gradient(135deg,#ffe563,#ffc663)] shadow-[0_15px_30px_rgba(0,0,0,0.3)]"
      >
        <div
          class="absolute inset-0 origin-bottom rounded-[15px] bg-white opacity-50 transition-transform duration-350 group-hover:[transform:rotateX(-5deg)_skewX(5deg)]"
        />

        <div
          class="absolute inset-0 origin-bottom rounded-[15px] bg-white opacity-50 transition-transform duration-350 group-hover:[transform:rotateX(-15deg)_skewX(12deg)]"
        />
      </div>

      <div
        class="relative z-10 origin-bottom transition-transform duration-350 group-hover:[transform:rotateX(-40deg)_skewX(15deg)]"
      >
        <div
          class="absolute top-[-10px] z-20 h-[20px] w-[80px] rounded-t-[12px] bg-[linear-gradient(135deg,#ff9a56,#ff6f56)] shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
        />

        <div
          class="h-[80px] w-[120px] rounded-[10px] bg-[linear-gradient(135deg,#ffe563,#ffc663)] shadow-[0_15px_30px_rgba(0,0,0,0.3)]"
        />
      </div>
    </div>

    <label
      class="relative w-full cursor-pointer rounded-[10px] bg-white/20 px-[35px] py-[10px] text-center text-[1.1em] text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-colors duration-350 hover:bg-white/40"
      @click="mainBtnHandler"
    >
      <input
        type="file"
        class="hidden"
      >
      选择 Emby 文件夹
    </label>
  </div>

  <el-timeline>
    <el-timeline-item>
      <div
        class="flex items-center"
      >
        <span>
          文件夹
        </span>

        <span
          class="m-x-2 text-6 color-primary font-bold"
        >
          {{ folderStore.embyFolder.folderName }}
        </span>

      </div>

    </el-timeline-item>

    <el-timeline-item>
      <div
        class="flex items-center"
      >
        <span>
          总共
        </span>

        <span
          class="m-x-2 text-6 color-primary font-bold"
        >
          {{ folderStore.embyFolder.folderFileList.length }}
        </span>

        <span>
          部
        </span>

      </div>

    </el-timeline-item>

    <el-timeline-item>
      <div
        class="flex items-center"
      >
        <span>
          已重复
        </span>

        <span
          class="m-x-2 text-6 color-primary font-bold"
        >
          {{ folderStore.embyFolder.folderDuplicateNameFileList.length }}
        </span>

        <span>
          部
        </span>
      </div>
    </el-timeline-item>

    <el-timeline-item>
      <div
        class="flex items-center"
      >
        <span>
          去重后
        </span>

        <span
          class="m-x-2 text-6 color-primary font-bold"
        >
          {{ folderStore.embyFolder.folderUniqueFileNameFileList.length }}
        </span>

        <span>
          部
        </span>
      </div>
    </el-timeline-item>

    <el-timeline-item>
      <div
        class="flex items-center"
      >
        <span>
          距上次扫描
        </span>

        <span
          class="m-x-2 text-6 color-primary font-bold"
        >
          {{ getElapsedTime(folderStore.embyFolder.folderScanTimestamp) }}
        </span>
      </div>
    </el-timeline-item>

    <el-timeline-item>
      <div
        class="flex items-center"
      >
        <span>
          上次扫描耗时
        </span>

        <span
          class="m-x-2 text-6 color-primary font-bold"
        >
          {{ folderStore.embyFolder.folderScanDuration }}
        </span>
      </div>
    </el-timeline-item>

    <el-timeline-item>
      <div
        class="flex items-center"
      >
        <span>
          最后扫描时间
        </span>

        <span
          class="m-x-2 text-6 color-primary font-bold"
        >
          {{ formatTimestampToChineseDate(folderStore.embyFolder.folderScanTimestamp) }}        </span>

      </div>
    </el-timeline-item>
  </el-timeline>

</template>

<style lang="scss" scoped>

</style>
