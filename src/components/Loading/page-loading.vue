<script setup lang="ts">
import gsap from 'gsap'

// 组件内部状态
const loadingText = ['L', 'O', 'A', 'D', 'I', 'N', 'G']

const welcomeMessage = ['欢', '迎', '来', '到', '我', '的', '插', '件']

/**
 * 隐藏loading动画
 */
function hideLoading() {
  return new Promise((resolve) => {
    const tl = gsap.timeline()

    tl.to('.loading-text span', {
      y: '200%',
      opacity: 0,
      ease: 'power4.inOut',
      duration: 2,
      stagger: 0.2,
    })

    tl.to('.loading-progress', {
      opacity: 0,
      ease: 'power4.inOut',
      duration: 2,
    }, '<')

    tl.to('.loading', {
      opacity: 0,
      ease: 'power4.inOut',
      onComplete: () => {
        resolve(true)
      },
    }, '-=1')
  })
}

const visible = ref(false)

const progress = ref(0)

const timer = ref<NodeJS.Timeout | null>(null)

/**
 * 开始 loading
 */
function startLoading() {
  visible.value = true
  progress.value = 0

  if (timer.value) {
    clearInterval(timer.value)
  }

  const interval = 50

  // 👉 只增长到 90，等待外部结束信号
  timer.value = setInterval(() => {
    if (progress.value < 90) {
      progress.value += 1
    }
  }, interval)
}

/**
 * 关闭 loading（只允许外部触发）
 */
function closeLoading() {
  alert('closeLoading')

  // 👉 防止异常调用
  if (!visible.value) {
    return
  }

  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }

  // 👉 补到 100（更丝滑）
  const finishTimer = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 2
    }
    else {
      clearInterval(finishTimer)

      hideLoading().then(() => {
        visible.value = false
      })
    }
  }, 20)
}

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
})

/**
 * 事件回调（必须用引用，off 才有效）
 */
function handleStart() {
  startLoading()
}

function handleEnd() {
  closeLoading()
}

pageLoadingMittBus.on('pageLoadingStart', handleStart)
pageLoadingMittBus.on('pageLoadingEnd', handleEnd)

onBeforeUnmount(() => {
  pageLoadingMittBus.off('pageLoadingStart', handleStart)
  pageLoadingMittBus.off('pageLoadingEnd', handleEnd)
})
</script>

<template>
  <div
    v-if="visible"
    class="loading pointer-events-none fixed bottom-0 left-0 right-0 top-0 z-[99999] bg-black"
  >
    <div
      class="h-full w-full flex flex-col items-center justify-center text-white tracking-3"
    >

      <div
        class="loading-text"
      >
        <span
          v-for="(letter, index) in loadingText"
          :key="index"
          :style="{
            '--index': index + 1,
          }"
          class="text-[2vw] max-sm:text-[7vw]"
        >
          {{ letter }}
        </span>
      </div>

      <div
        class="loading-text"
      >
        <span
          v-for="(letter, index) in welcomeMessage"
          :key="index"
          :style="{ '--index': index + 1 }"
          class="text-[2vw] max-sm:text-[7vw]"
        >
          {{ letter }}
        </span>
      </div>

    </div>

    <div
      class="loading-progress absolute left-1/2 top-1/2 mt-[-5vw] flex origin-center translate-x--1/2 translate-y--1/2 items-center text-white max-sm:mt-[-20vw]"
    >
      <div
        class="text-[2vw] max-sm:text-9"
      >
        {{ progress }}
      </div>

      <div
        class="pl-3 text-[1vw] max-sm:text-7"
      >
        %
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
span {
  animation: blurAni 1.5s calc(var(--index) / 5 * 1s) alternate infinite;
}

@keyframes blurAni {
  to {
    filter: blur(3px);
  }
}
</style>
