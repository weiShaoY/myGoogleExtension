<script lang="ts" setup>

/**
 * 引入配置（视频扩展名规则等）
 */
import { AdultConfig } from '@/configs'

/**
 * loading 状态（支持 v-model:isLoading）
 */
const isLoading = defineModel<boolean>('isLoading', {
  default: false,
})

/**
 * Pinia store（业务数据存储）
 */
const adultStore = useAdultStore()

/**
 * 文件数据类型（统一结构）
 * 👉 用于描述“扫描过程中”的中间态数据
 */
type FileData = {

  /** 文件对象 */
  file: File

  /** 当前文件所在路径数组 */
  directoryPath: string[]

  /** nfo 文件内容（可选） */
  nfoContent: string
}

/**
 * 视频文件集合
 * 👉 用 Set 去重
 */
const videoFileSet: Set<AdultType.VideoFile> = new Set([])

/**
 * 获取视频元数据（分辨率 + 时长）
 * 👉 通过 video 标签解析 file
 */
function getVideoMeta(
  file: File,
): Promise<{
  duration: number
  width: number
  height: number
}> {
  return new Promise((resolve) => {
    /**
     * 创建 video 元素用于解析 metadata
     */
    const video = document.createElement('video')

    //  只加载 metadata，不下载视频内容
    video.preload = 'metadata'

    /**
     * 元数据加载完成回调
     */
    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      })

      //  释放 blob，避免内存泄漏
      URL.revokeObjectURL(video.src)
    }

    //  创建 blob URL
    video.src = URL.createObjectURL(file)
  })
}

/**
 * 并发控制工具
 * 👉 限制同时执行任务数量
 */
async function runWithConcurrency<T>(
  list: T[],
  limit: number,
  handler: (item: T) => Promise<any>,
) {
  /**
   * 所有任务
   */
  const result: Promise<any>[] = []

  /**
   * 当前执行池
   */
  const pool: Promise<any>[] = []

  //  遍历任务列表
  for (const item of list) {
    /**
     * 执行任务
     */
    const task = handler(item)

    result.push(task)

    /**
     * 加入执行池
     */
    const p = task.finally(() => {
      pool.splice(pool.indexOf(p), 1)
    })

    pool.push(p)

    //  控制并发数
    if (pool.length >= limit) {
      await Promise.race(pool)
    }
  }

  /**
   * 等待全部完成
   */
  return Promise.all(result)
}

/**
 * 处理单个文件
 * 👉 转换 FileData -> VideoFile
 */
async function processFile(fileData: FileData) {
  try {
    /**
     * 文件对象
     */
    const file = fileData.file

    /**
     * 获取视频元数据
     */
    const meta = await getVideoMeta(file)

    /**
     * 文件基础名（去后缀）
     */
    const baseName = file.name.substring(0, file.name.lastIndexOf('.'))

    /**
     * 构建最终数据结构
     */
    const item: AdultType.VideoFile = {
      id: getRandomNumber(),

      baseName,

      /**
       * 清洗后的名称
       */
      cleanName: baseName
        .toLowerCase()
        .replace(videoFileTagExtractionRegex, ''),

      originalName: file.name,

      /**
       * 文件大小（GB）
       */
      size: `${(file.size / 1024 ** 3).toFixed(2)} GB`,

      /**
       * 文件扩展名
       */
      extension: file.name.replace(/^.*\./, ''),

      /**
       * 完整路径
       */
      path: fileData.directoryPath.concat(file.name).join('/'),

      /**
       * 标签提取
       */
      tags: getVideoTagsFromName(baseName),

      /**
       * 分辨率
       */
      resolution: `${meta.width}x${meta.height}`,

      /**
       * 视频时长
       */
      durationText: parseVideoDurationToSeconds(meta.duration),

      /**
       * 是否含中文字幕
       */
      hasChineseSubtitle:
        file.name.includes('-c')
        || file.name.includes('-C')
        || file.name.includes('_ch'),
    }

    return item
  }
  catch (e) {
    console.error('processFile error:', e)
    return null
  }
}

/**
 * input 选择文件方式（fallback 模式）
 */
async function handleInputSelect(e: Event) {
  /**
   * 获取 input files
   */
  const files = (e.target as HTMLInputElement).files

  if (!files) {
    return
  }

  // ✅ 用户确认后开始
  pageLoadingMittBus.emit('pageLoadingStart')

  isLoading.value = true

  //  清空集合
  videoFileSet.clear()

  /**
   * 开始时间
   */
  const startTime = Date.now()

  try {
  /**
   * 文件列表
   */
    const fileList: FileData[] = []

    //  遍历文件
    for (const file of files) {
    //  过滤非视频文件
      if (
        !AdultConfig.rules.videoExtRules.some(ext =>
          file.name.endsWith(`.${ext}`),
        )
      ) {
        continue
      }

      /**
     * 相对路径拆分
     */
      const path = file.webkitRelativePath.split('/')

      fileList.push({
        file,
        directoryPath: path.slice(0, -1),
        nfoContent: '',
      })
    }

    /**
   * 并发处理
   */
    const result = await runWithConcurrency(fileList, 5, processFile)

    //  写入 Set
    result.forEach((item) => {
      if (item) {
        videoFileSet.add(item)
      }
    })

    //  保存到 store
    adultStore.saveEmbyFolderData(
      fileList[0]?.directoryPath?.[0] || '未知文件夹',
      Array.from(videoFileSet),
      startTime,
    )
  }
  finally {
    // ✅ 一定结束

    isLoading.value = false

    pageLoadingMittBus.emit('pageLoadingEnd')
  }
}

/**
 * directory picker（浏览器原生 API）
 */
async function handleDirectoryPicker() {
  const directoryHandle: FileSystemDirectoryHandle
    = await (window as any).showDirectoryPicker()

  // ✅ 用户确认选择后才开始
  pageLoadingMittBus.emit('pageLoadingStart')

  isLoading.value = true

  videoFileSet.clear()

  const startTime = Date.now()

  try {
  /**
   * 递归扫描目录
   */
    async function* getFiles(
      dir: any,
      path: string[] = [],
    ): AsyncGenerator<FileData> {
      for await (const [name, handle] of dir.entries()) {
      /**
       * 文件节点
       */
        if (handle.kind === 'file') {
          const file = await handle.getFile()

          /**
         * 视频过滤
         */
          if (
            !AdultConfig.rules.videoExtRules.some(ext =>
              name.endsWith(`.${ext}`),
            )
          ) {
            continue
          }

          yield {
            file,
            directoryPath: [...path],
            nfoContent: '',
          }
        }

        /**
       * 文件夹递归
       */
        else {
          yield* getFiles(handle, [...path, name])
        }
      }
    }

    /**
   * 收集文件
   */
    const fileList: FileData[] = []

    for await (const f of getFiles(directoryHandle, [
      directoryHandle.name,
    ])) {
      fileList.push(f)
    }

    /**
   * 并发处理
   */
    const result = await runWithConcurrency(fileList, 1, processFile)

    /**
   * 写入 Set
   */
    result.forEach((item) => {
      if (item) {
        videoFileSet.add(item)
      }
    })

    /**
   * 存储 Pinia
   */
    adultStore.saveEmbyFolderData(
      directoryHandle.name,
      Array.from(videoFileSet),
      startTime,
    )

  // isLoading.value = false
  }
  finally {
    isLoading.value = false

    pageLoadingMittBus.emit('pageLoadingEnd')
  }
}

/**
 * 主入口（自动降级）
 * 👉 优先 folder picker，否则 input
 */
async function mainBtnHandler() {
  //  支持 showDirectoryPicker
  if ('showDirectoryPicker' in window) {
    try {
      await handleDirectoryPicker()
      return
    }
    catch {}
  }

  /**
   * fallback input
   */
  document.getElementById('folderInput')?.click()
}
</script>

<template>
  <div
    class="h-full flex flex-col items-center justify-center gap-10"
  >

    <!-- 选择按钮 -->
    <!-- <div
      class="cursor-pointer rounded-lg bg-emby px-8 py-6 text-8 text-white font-bold hover:bg-green-600"
      @click="mainBtnHandler"
    >
      选择 Emby 文件夹
    </div> -->

    <!-- 隐藏 input -->
    <input
      id="folderInput"
      type="file"
      webkitdirectory
      class="hidden"
      @change="handleInputSelect"
    >

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
        class="relative w-[80%] cursor-pointer rounded-[10px] bg-white/20 px-[35px] py-[10px] text-center text-[1.1em] text-white font-bold shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-colors duration-350 hover:bg-white/40"
        @click="mainBtnHandler"
      >

        选择 Emby 文件夹
      </label>
    </div>

    <!-- 信息展示 -->
    <el-timeline
      class="text-6"
    >
      <el-timeline-item>
        <div
          class="flex items-center"
        >
          <span>
            📁  文件夹
          </span>

          <span
            class="m-x-2 text-6 color-emby font-bold"
          >
            {{ adultStore.embyFolder.folderName }}
          </span>

        </div>

      </el-timeline-item>

      <el-timeline-item>
        <div
          class="flex items-center"
        >
          <span>
            🎬  总共
          </span>

          <span
            class="m-x-2 text-6 color-emby font-bold"
          >
            {{ adultStore.embyFolder.folderVideoFiles.length }}
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
            ♻️  已重复
          </span>

          <span
            class="m-x-2 text-6 color-emby font-bold"
          >
            {{ adultStore.embyFolder.folderAllDuplicateVideoFiles.length }}
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
            ✅  去重后
          </span>

          <span
            class="m-x-2 text-6 color-emby font-bold"
          >
            {{ adultStore.embyFolder.folderUniqueDuplicateVideoNames.length }}
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
            ⏰  上次扫描耗时
          </span>

          <span
            class="m-x-2 text-6 color-emby font-bold"
          >
            {{ adultStore.embyFolder.folderScanDuration }}
          </span>
        </div>
      </el-timeline-item>

      <el-timeline-item>
        <div
          class="flex items-center"
        >
          <span>
            🕒  距离上次扫描
          </span>

          <span
            class="m-x-2 text-6 color-emby font-bold"
          >
            {{ getElapsedTime(adultStore.embyFolder.folderScanTimestamp) }}
          </span>
        </div>
      </el-timeline-item>

      <el-timeline-item>
        <div
          class="flex items-center"
        >
          <span>
            🧭  最后扫描时间
          </span>

          <span
            class="m-x-2 text-6 color-emby font-bold"
          >
            {{ formatTimestampToChineseDate(adultStore.embyFolder.folderScanTimestamp) }}        </span>

        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<style scoped>
</style>
