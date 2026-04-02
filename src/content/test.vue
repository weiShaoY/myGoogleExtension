<!------  2026-03-29---21:59---星期天  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
const testStore = useTestStore()

function testValueClick() {
  testStore.testValue++
}

function testObjClick() {
  testStore.testObj.a++
}
</script>

<template>
  <div
    class="fixed right-10 top-60 flex flex-col items-center gap-3"
  >

    <div
      class="flex items-center justify-center gap-3"
    >
      <div
        class="h-full w-30 flex items-center justify-center bg-red"
      >
        {{ testStore.testValue }}

      </div>

      <el-button
        class=""
        @click="testValueClick"
      >
        测试 单个值
      </el-button>

    </div>

    <div
      class="flex items-center justify-center gap-3"
    >
      <div
        class="h-full w-30 flex items-center justify-center bg-emerald"
      >
        {{ testStore.testObj }}

      </div>

      <el-button
        class=""
        @click="testObjClick"
      >
        测试 对象
      </el-button>
    </div>

    <div
      v-copy="{
        text: '3333333333333333',
      }"
      class="mt-20 h-20 w-20 bg-red"
    >
      测试指令

    </div>
    <!-- //////////////////////////////////// -->
    <div
      class=""
    >
      <div
        class="box-border flex flex-col items-center justify-center gap-[1.25em]"
      >
        <!-- 按钮组 -->
        <div
          class="flex flex-col gap-[1.5em]"
        >
          <!-- 第一行：减号 + 加号 -->
          <div
            class="flex gap-[1.5em]"
          >
            <div
              class="h-[5em] w-[5em] flex items-center justify-center rounded-[5px] bg-[#171717]"
            >
              <button
                class="font-montserrat h-[5.7em] w-[5.7em] cursor-pointer rounded-[10px] border-none bg-[#c7c3c0] shadow-[rgba(0,0,0,0.377)_10px_10px_8px,_#ffffff_1.5px_1.5px_2px_0px_inset,_#c7c3c0_-3.2px_-3.2px_8px_0px_inset] outline-none transition-all duration-100 ease-in-out active:shadow-[rgba(0,0,0,0.377)_0px_0px_0px,_0.5px_0.5px_4px_#000000_inset,_#c7c3c0_-3.2px_-3.2px_8px_0px_inset]"
              >
                <svg
                  viewBox="0 -960 960 960"
                  class="h-[25px] w-[25px] fill-[#5f5f5f] transition-all duration-100 ease-in-out active:scale-95"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M200-440v-80h560v80H200Z"
                  />
                </svg>
              </button>
            </div>

            <div
              class="h-[5em] w-[5em] flex items-center justify-center rounded-[5px] bg-[#171717]"
            >
              <button
                class="font-montserrat h-[5.7em] w-[5.7em] cursor-pointer rounded-[10px] border-none bg-[#c7c3c0] shadow-[rgba(0,0,0,0.377)_10px_10px_8px,_#ffffff_1.5px_1.5px_2px_0px_inset,_#c7c3c0_-3.2px_-3.2px_8px_0px_inset] outline-none transition-all duration-100 ease-in-out active:shadow-[rgba(0,0,0,0.377)_0px_0px_0px,_0.5px_0.5px_4px_#000000_inset,_#c7c3c0_-3.2px_-3.2px_8px_0px_inset]"
              >
                <svg
                  viewBox="0 -960 960 960"
                  class="h-[25px] w-[25px] fill-[#5f5f5f] transition-all duration-100 ease-in-out active:scale-95"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- 第二行：RECORD + PLAY -->
          <div
            class="flex gap-[1.5em]"
          >
            <div
              class="h-[5em] w-[5em] flex items-center justify-center rounded-[5px] bg-[#171717]"
            >
              <button
                class="font-montserrat h-[5.7em] w-[5.7em] flex cursor-pointer items-start justify-center rounded-[10px] border-none bg-[#d42a02] shadow-[rgba(0,0,0,0.377)_10px_10px_8px,_#fb702c_2px_2px_10px_0px_inset,_#d42a02_-4px_-4px_1px_0px_inset] outline-none transition-all duration-100 ease-in-out active:shadow-[rgba(0,0,0,0.377)_0px_0px_0px,_0.5px_0.5px_4px_#000000_inset,_#d42a02_-3.2px_-3.2px_8px_0px_inset]"
              >
                emby
              </button>
            </div>

            <div
              class="h-[5em] w-[5em] flex items-center justify-center rounded-[5px] bg-[#171717]"
            >
              <button
                class="font-montserrat h-[5.7em] w-[5.7em] flex cursor-pointer items-start justify-center rounded-[10px] border-none bg-[#545251] shadow-[rgba(0,0,0,0.377)_10px_10px_8px,_#a8a6a4_1.5px_1.5px_1px_0px_inset,_#545251_-3.2px_-3.2px_8px_0px_inset] outline-none transition-all duration-100 ease-in-out active:shadow-[rgba(0,0,0,0.377)_0px_0px_0px,_0.5px_0.5px_4px_#000000_inset,_#545251_-3.2px_-3.2px_8px_0px_inset]"
              >
                <span
                  class="pt-[0.9em] text-[0.85em] text-white tracking-[0.075em] transition-all duration-100 ease-in-out active:translate-y-[0.5px]"
                >
                  PLAY
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- 底部文字 -->
        <div
          class="font-montserrat text-center text-[0.65em]"
        >
          Teenage Engineering [EP-133 K.O. II] - Buttons
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="scss" scoped>

</style>
