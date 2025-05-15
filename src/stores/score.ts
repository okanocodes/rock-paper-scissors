import { ref } from 'vue'
// import { computed } from 'vue'
import { defineStore } from 'pinia'

export const useScoreStore = defineStore('score', () => {
  const count = ref(0)
  // const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, increment }
})
