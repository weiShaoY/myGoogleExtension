<script lang="ts" setup>

import { AdultConfig } from '@/configs'

/**
 * 扫描进度计数（已处理的视频文件数）
 */
const scanCount = ref(0)

/**
 * 页面是否正在扫描（用于 loading 展示）
 */
const isLoading = ref(false)

/**
 * 成人内容相关 Store（用于保存扫描结果）
 */
const adultStore = useAdultStore()

/**
 * 扫描中间态文件数据结构
 */
type FileData = {

  /**
   * 文件对象
   */
  file: File

  /**
   * 文件所在目录路径（分段数组）
   */
  directoryPath: string[]

  /**
   * 预留：nfo 文件内容（此页暂未读取）
   */
  nfoContent: string
}

/**
 * 每处理 N 个文件让出一次主线程（避免大数据量卡 UI）
 */
const YIELD_EVERY_N_ITEMS = 25

/**
 * input 模式并发数（同时解析 metadata 的数量）
 */
const inputConcurrency = 3

/**
 * directory picker 模式并发数（通常保持 1，避免同时创建过多 video 元素）
 */
const directoryConcurrency = 1

/**
 * 支持的视频扩展名列表（统一小写，用于 endsWith 匹配）
 */
const videoExtRules = AdultConfig.rules.videoExtRules.map(ext => ext.toLowerCase())

/**
 * 执行扫描并保存到 store
 * @param folderName 文件夹名
 * @param files 扫描到的视频文件流
 * @param concurrency 并发解析数量
 */
async function scan(folderName: string, files: AsyncIterable<FileData>, concurrency: number) {
  scanCount.value = 0
  isLoading.value = true

  /**
   * 扫描开始时间戳（用于计算耗时）
   */
  const startTime = Date.now()

  /**
   * 扫描结果集合（用于去重）
   */
  const videoFileSet = new Set<AdultType.VideoFile>()

  /**
   * 并发执行池
   */
  const pool = new Set<Promise<void>>()

  /**
   * 已开始处理的文件数量（用于 yield 节奏控制）
   */
  let started = 0

  /**
   * 让出主线程（避免长任务阻塞 UI）
   */
  const yieldToBrowser = () => new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })

  try {
    for await (const fileData of files) {
      /**
       * 当前待处理文件数据（显式变量便于注释与调试）
       */
      const currentFileData = fileData

      started += 1

      /**
       * 当前文件的处理任务（加入并发池）
       */
      const task = (async () => {
        try {
          scanCount.value += 1

          /**
           * 当前文件对象
           */
          const file = currentFileData.file

          /**
           * 文件名最后一个点号位置（用于切割 baseName）
           */
          const dotIdx = file.name.lastIndexOf('.')

          /**
           * 基础文件名（不包含扩展名）
           */
          const baseName = dotIdx > 0 ? file.name.substring(0, dotIdx) : file.name

          videoFileSet.add({
            id: getRandomNumber(),
            baseName,
            cleanName: baseName.toLowerCase().replace(videoFileTagExtractionRegex, ''),
            originalName: file.name,
            size: `${(file.size / 1024 ** 3).toFixed(2)} GB`,
            extension: file.name.replace(/^.*\./, ''),
            path: currentFileData.directoryPath.concat(file.name).join('/'),
            tags: getVideoTagsFromName(baseName),

            hasChineseSubtitle:
              file.name.includes('-c')
              || file.name.includes('-C')
              || file.name.includes('_ch'),
          })
        }
        catch (e) {
          console.error('processFile error:', e)
        }
      })()

      pool.add(task)
      task.finally(() => pool.delete(task))

      if (pool.size >= concurrency) {
        await Promise.race(pool)
      }

      if (started % YIELD_EVERY_N_ITEMS === 0) {
        await yieldToBrowser()
      }
    }

    await Promise.allSettled(Array.from(pool))

    adultStore.saveEmbyFolderData(folderName, Array.from(videoFileSet), startTime)
  }
  finally {
    isLoading.value = false
  }
}

async function handleInputSelect(e: Event) {
  /**
   * input 选择的 FileList
   */
  const files = (e.target as HTMLInputElement).files

  if (!files) {
    return
  }

  /**
   * FileList 的稳定引用（避免 TS 缩小范围丢失）
   */
  const filesList = files

  /**
   * 从相对路径提取文件夹名
   */
  const folderName = filesList.item(0)?.webkitRelativePath?.split('/')?.[0] || '未知文件夹'

  async function* iterFiles(): AsyncGenerator<FileData> {
    for (const file of filesList) {
      /**
       * 当前文件对象（显式变量便于注释与调试）
       */
      const currentFile = file

      /**
       * 当前文件名小写（用于后缀匹配）
       */
      const lower = currentFile.name.toLowerCase()

      if (!videoExtRules.some(ext => lower.endsWith(`.${ext}`))) {
        continue
      }

      /**
       * 相对路径拆分数组
       */
      const path = currentFile.webkitRelativePath.split('/')

      yield {
        file: currentFile,
        directoryPath: path.slice(0, -1),
        nfoContent: '',
      }
    }
  }

  await scan(folderName, iterFiles(), inputConcurrency)
}

/**
 * 主入口（自动降级）
 * 👉 优先 folder picker，否则 input
 */
async function mainBtnHandler() {
  //  支持 showDirectoryPicker
  if ('showDirectoryPicker' in window) {
    try {
      /**
       * 用户选择的目录句柄
       */
      const directoryHandle: FileSystemDirectoryHandle
        = await (window as any).showDirectoryPicker()

      async function* walk(dir: FileSystemDirectoryHandle, path: string[]): AsyncGenerator<FileData> {
        for await (const entry of dir.entries()) {
          /**
           * 当前条目名称
           */
          const name = entry[0]

          /**
           * 当前条目句柄（文件 / 目录）
           */
          const handle = entry[1]

          if (handle.kind === 'file') {
            /**
             * 当前文件名小写（用于后缀匹配）
             */
            const lower = name.toLowerCase()

            if (!videoExtRules.some(ext => lower.endsWith(`.${ext}`))) {
              continue
            }

            yield {
              file: await handle.getFile(),
              directoryPath: [...path],
              nfoContent: '',
            }
          }
          else {
            yield* walk(handle, [...path, name])
          }
        }
      }

      await scan(directoryHandle.name, walk(directoryHandle, [directoryHandle.name]), directoryConcurrency)
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
