<script lang="ts" setup>

import { AdultConfig } from '@/configs'

const scanCount = ref(0)

const isLoading = ref(false)

const adultStore = useAdultStore()

type FileData = {
  file: File
  directoryPath: string[]
  nfoContent: string
}

const VIDEO_META_TIMEOUT_MS = 10_000

const YIELD_EVERY_N_ITEMS = 25

const INPUT_CONCURRENCY = 3

const DIRECTORY_CONCURRENCY = 1

const videoExtRules = AdultConfig.rules.videoExtRules

function isSupportedVideoFile(fileName: string) {
  const lower = fileName.toLowerCase()

  return videoExtRules.some(ext => lower.endsWith(`.${ext.toLowerCase()}`))
}

function getBaseName(fileName: string) {
  const idx = fileName.lastIndexOf('.')

  return idx > 0 ? fileName.substring(0, idx) : fileName
}

function getFolderNameFromInputFiles(files: FileList) {
  const firstFile = files.item(0)

  return firstFile?.webkitRelativePath?.split('/')?.[0] || '未知文件夹'
}

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
    const video = document.createElement('video')

    //  只加载 metadata，不下载视频内容
    video.preload = 'metadata'

    const objectUrl = URL.createObjectURL(file)

    let finished = false

    const cleanup = () => {
      try {
        video.onloadedmetadata = null
        video.onerror = null

        //  触发资源释放
        video.removeAttribute('src')
        video.load()
        video.remove()
      }
      catch {}

      try {
        URL.revokeObjectURL(objectUrl)
      }
      catch {}
    }

    const finish = (meta: { duration: number, width: number, height: number }) => {
      if (finished) {
        return
      }

      finished = true
      cleanup()
      resolve(meta)
    }

    const timer = window.setTimeout(() => {
      //  超时：避免某些异常文件导致 Promise 永远不 resolve
      finish({
        duration: 0,
        width: 0,
        height: 0,
      })
    }, VIDEO_META_TIMEOUT_MS)

    video.onloadedmetadata = () => {
      window.clearTimeout(timer)
      finish({
        duration: Number.isFinite(video.duration) ? video.duration : 0,
        width: Number.isFinite(video.videoWidth) ? video.videoWidth : 0,
        height: Number.isFinite(video.videoHeight) ? video.videoHeight : 0,
      })
    }

    video.onerror = () => {
      window.clearTimeout(timer)
      finish({
        duration: 0,
        width: 0,
        height: 0,
      })
    }

    video.src = objectUrl
  })
}

/**
 * 让出主线程（避免大数据量时长任务卡死）
 */
async function yieldToBrowser() {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

/**
 * 并发控制（支持超大列表）
 * 👉 不再把所有 Promise 收集到数组里，避免大数据量内存暴涨
 */
async function runWithConcurrency<T, R>(
  iterable: AsyncIterable<T>,
  limit: number,
  handler: (item: T) => Promise<R>,
  onResult?: (result: R) => void,
) {
  const pool = new Set<Promise<void>>()

  let started = 0

  for await (const item of iterable) {
    started += 1

    const task = (async () => {
      const result = await handler(item)

      onResult?.(result)
    })()

    pool.add(task)

    task.finally(() => {
      pool.delete(task)
    })

    if (pool.size >= limit) {
      await Promise.race(pool)
    }

    //  扫描/处理数量大时，定期让出主线程
    if (started % YIELD_EVERY_N_ITEMS === 0) {
      await yieldToBrowser()
    }
  }

  await Promise.allSettled(Array.from(pool))
}

async function toVideoFile(fileData: FileData) {
  try {
    scanCount.value += 1

    const file = fileData.file

    const meta = await getVideoMeta(file)

    const baseName = getBaseName(file.name)

    const item: AdultType.VideoFile = {
      id: getRandomNumber(),

      baseName,

      cleanName: baseName
        .toLowerCase()
        .replace(videoFileTagExtractionRegex, ''),

      originalName: file.name,

      size: `${(file.size / 1024 ** 3).toFixed(2)} GB`,

      extension: file.name.replace(/^.*\./, ''),

      path: fileData.directoryPath.concat(file.name).join('/'),

      tags: getVideoTagsFromName(baseName),

      resolution: meta.width > 0 && meta.height > 0
        ? `${meta.width}x${meta.height}`
        : '',

      durationText: parseVideoDurationToSeconds(meta.duration),

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

async function* getInputVideoFiles(files: FileList): AsyncGenerator<FileData> {
  for (const file of files) {
    if (!isSupportedVideoFile(file.name)) {
      continue
    }

    const path = file.webkitRelativePath.split('/')

    yield {
      file,
      directoryPath: path.slice(0, -1),
      nfoContent: '',
    }
  }
}

async function* getDirectoryVideoFiles(
  dir: FileSystemDirectoryHandle,
  path: string[] = [],
): AsyncGenerator<FileData> {
  for await (const [name, handle] of dir.entries()) {
    if (handle.kind === 'file') {
      if (!isSupportedVideoFile(name)) {
        continue
      }

      yield {
        file: await handle.getFile(),
        directoryPath: [...path],
        nfoContent: '',
      }

      continue
    }

    yield* getDirectoryVideoFiles(handle, [...path, name])
  }
}

async function scanAndSave(
  folderName: string,
  files: AsyncIterable<FileData>,
  concurrency: number,
) {
  scanCount.value = 0
  isLoading.value = true

  const startTime = Date.now()

  const videoFileSet = new Set<AdultType.VideoFile>()

  try {
    await runWithConcurrency(files, concurrency, toVideoFile, (item) => {
      if (item) {
        videoFileSet.add(item)
      }
    })

    adultStore.saveEmbyFolderData(folderName, Array.from(videoFileSet), startTime)
  }
  finally {
    isLoading.value = false
  }
}

async function handleInputSelect(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files) {
    return
  }

  await scanAndSave(
    getFolderNameFromInputFiles(files),
    getInputVideoFiles(files),
    INPUT_CONCURRENCY,
  )
}

async function handleDirectoryPicker() {
  const directoryHandle: FileSystemDirectoryHandle
    = await (window as any).showDirectoryPicker()

  await scanAndSave(
    directoryHandle.name,
    getDirectoryVideoFiles(directoryHandle, [directoryHandle.name]),
    DIRECTORY_CONCURRENCY,
  )
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

  document.getElementById('folderInput')?.click()
}
</script>

<template>
  <div
    class="h-full flex flex-col items-center justify-center gap-10"
  >

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

    <div
      v-if="isLoading"
      class="mt-4 flex items-center gap-5 text-6"
    >
      <div
        class=""
      >
        扫描视频文件中
      </div>

      <div
        class="w-30 text-8 color-emby font-bold"
      >
        {{ scanCount }}
      </div>

    </div>
  </div>
</template>

<style scoped>
</style>
