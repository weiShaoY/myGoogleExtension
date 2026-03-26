import { defineStore } from 'pinia'

export const useTestStore = defineStore(
  'test',
  () => {
    const testValue = ref(0)

    const testObj = ref({
      a: 1,
    })

    return {
      testValue,
      testObj,
    }
  },
  {

  },
)
