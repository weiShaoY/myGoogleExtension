<script lang="ts" setup>
import { AdultConfig } from '@/configs'

const isLoading = defineModel<boolean>('isLoading', {
  default: false,
})

const adultStore = useAdultStore()

/**
 * 文件数据类型（统一结构）
 */
type FileData = {

  /** 文件对象 */
  file: File

  /** 所在目录路径 */
  directoryPath: string[]

  /** nfo 内容 */
  nfoContent: string
}

/**
 * 视频文件集
 */
const videoFileSet: Set<AdultType.VideoFile> = new Set([])

/**
 * 获取视频元数据
 * 👉 获取分辨率 + 时长
 */
function getVideoMeta(file: File): Promise<{
  duration: number
  width: number
  height: number
}> {
  return new Promise((resolve) => {
    const video = document.createElement('video')

    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      })

      URL.revokeObjectURL(video.src)
    }

    video.src = URL.createObjectURL(file)
  })
}

/**
 * 并发控制工具
 */
async function runWithConcurrency<T>(
  list: T[],
  limit: number,
  handler: (item: T) => Promise<any>,
) {
  const result: Promise<any>[] = []

  const pool: Promise<any>[] = []

  for (const item of list) {
    const task = handler(item)

    result.push(task)

    const p = task.finally(() => {
      pool.splice(pool.indexOf(p), 1)
    })

    pool.push(p)

    if (pool.length >= limit) {
      await Promise.race(pool)
    }
  }

  return Promise.all(result)
}

/**
 * 处理单个文件
 */
async function processFile(fileData: FileData) {
  try {
    const file = fileData.file

    const meta = await getVideoMeta(file)

    const baseName = file.name.substring(0, file.name.lastIndexOf('.'))

    const item: AdultType.VideoFile = {
      id: getRandomNumber(),

      size: `${(file.size / 1024 ** 3).toFixed(2)} GB`,

      baseName,

      originalName: file.name,

      cleanName: baseName
        .toLowerCase()
        .replace(videoFileTagExtractionRegex, ''),

      extension: file.name.replace(/^.*\./, ''),

      path: fileData.directoryPath.concat(file.name).join('/'),

      tags: getVideoTagsFromName(baseName),

      resolution: `${meta.width}x${meta.height}`,

      duration: meta.duration,

      hasChineseSubtitle:
        file.name.includes('-c')
        || file.name.includes('-C')
        || file.name.includes('_ch'),
    }

    return item
  }
  catch (e) {
    console.error(e)
    return null
  }
}

/**
 * input 方式（插件环境）
 */
async function handleInputSelect(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files) {
    return
  }

  isLoading.value = true
  videoFileSet.clear()

  const startTime = Date.now()

  const fileList: FileData[] = []

  for (const file of files) {
    if (!AdultConfig.rules.videoExtRules.some(ext => file.name.endsWith(`.${ext}`))) {
      continue
    }

    const path = file.webkitRelativePath.split('/')

    fileList.push({
      file,
      directoryPath: path.slice(0, -1),
      nfoContent: '',
    })
  }

  const result = await runWithConcurrency(fileList, 5, processFile)

  result.forEach((item) => {
    if (item) {
      videoFileSet.add(item)
    }
  })

  adultStore.saveEmbyFolderData(
    fileList[0]?.directoryPath?.[0] || '未知文件夹',
    Array.from(videoFileSet),
    startTime,
  )

  isLoading.value = false
}

/**
 * directoryPicker（浏览器环境）
 */
async function handleDirectoryPicker() {
  const directoryHandle: FileSystemDirectoryHandle = await (window as any).showDirectoryPicker()

  isLoading.value = true
  videoFileSet.clear()

  const startTime = Date.now()

  /**
 * 文件递归扫描生成器
 */
  async function* getFiles(
    dir: any,
    path: string[] = [],
  ): AsyncGenerator<{
    file: File
    directoryPath: string[]
    nfoContent: string
  }, void, unknown> {
    for await (const [name, handle] of dir.entries()) {
      if (handle.kind === 'file') {
        const file = await handle.getFile()

        if (!AdultConfig.rules.videoExtRules.some(ext => name.endsWith(`.${ext}`))) {
          continue
        }

        yield {
          file,
          directoryPath: [...path],
          nfoContent: '',
        }
      }
      else {
        yield* getFiles(handle, [...path, name])
      }
    }
  }

  const fileList: FileData[] = []

  for await (const f of getFiles(directoryHandle, [directoryHandle.name])) {
    fileList.push(f)
  }

  const result = await runWithConcurrency(fileList, 5, processFile)

  result.forEach((item) => {
    if (item) {
      videoFileSet.add(item)
    }
  })

  adultStore.saveEmbyFolderData(
    directoryHandle.name,
    Array.from(videoFileSet),
    startTime,
  )

  isLoading.value = false
}

/**
 * 主入口（自动降级）
 */
async function mainBtnHandler() {
  if ('showDirectoryPicker' in window) {
    try {
      await handleDirectoryPicker()
      return
    }
    catch {}
  }

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
