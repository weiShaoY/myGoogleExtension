import { defineStore } from 'pinia'

const useTestStore = defineStore(
  'test',
  () => {
    const testOBJ = {
      a: 1,
      b: 2,
      c: 3,
    }

    return {
      testOBJ,
    }
  },
  {

  },
)

export default useTestStore
