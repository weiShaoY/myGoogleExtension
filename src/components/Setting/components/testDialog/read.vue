<!------  2026-03-27---01:18---星期五  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
function openFolder() {
  console.log('🚀 ~ file: one.vue:7 ~ openFolder:')
}
</script>

<template>

  <section
    class="group relative h-full w-full flex flex-col items-center justify-center"
  >
    <div
      class="file [perspective:1500px] relative z-50 h-40 w-60 origin-bottom cursor-pointer"
    >
      <div
        class="work-5 relative h-full w-full origin-top rounded-2xl rounded-tl-none bg-amber-600 transition-all duration-300 ease before:[clip-path:polygon(0_35%,0%_100%,50%_100%);] after:absolute before:absolute after:bottom-[99%] after:left-0 before:left-[75.5px] after:h-4 after:w-20 before:h-4 before:w-4 after:rounded-t-2xl after:bg-amber-600 before:bg-amber-600 group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)] after:content-[''] before:content-[''] before:-top-[15px]"
      />

      <div
        class="work-4 absolute inset-1 origin-bottom select-none rounded-2xl bg-zinc-400 transition-all duration-300 ease group-hover:[transform:rotateX(-20deg)]"
      />

      <div
        class="work-3 absolute inset-1 origin-bottom rounded-2xl bg-zinc-300 transition-all duration-300 ease group-hover:[transform:rotateX(-30deg)]"
      />

      <div
        class="work-2 absolute inset-1 origin-bottom rounded-2xl bg-zinc-200 transition-all duration-300 ease group-hover:[transform:rotateX(-38deg)]"
      />

      <div
        class="work-1 absolute bottom-0 h-[156px] w-full flex origin-bottom items-end rounded-2xl rounded-tr-none from-amber-500 to-amber-400 bg-gradient-to-t transition-all duration-300 ease before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);] group-hover:[transform:rotateX(-46deg)_translateY(1px)] after:absolute before:absolute after:bottom-[99%] after:right-0 before:right-[142px] before:size-3 after:h-[16px] after:w-[146px] after:rounded-t-2xl after:bg-amber-400 before:bg-amber-400 group-hover:shadow-[inset_0_20px_40px_#fbbf24,_inset_0_-20px_40px_#d97706] after:content-[''] before:content-[''] before:-top-[10px]"
        @click="openFolder"
      />
    </div>

    <p
      class="pt-4 text-3xl opacity-20"
    >
      选择 Emby 文件夹
    </p>
  </section>

</template>

<style lang="scss" scoped>

</style>
