<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

const emits = defineEmits(['close'])

const target = ref<HTMLElement | null>(null)
onClickOutside(target, () => {
  emits('close')
})
</script>

<template>
  <div ref="target" class="modal">
    <div class="modal__title">
      <slot name="title"></slot>
    </div>
    <button @click="$emit('close')" class="close"></button>
    <div class="modal_content">
      <slot></slot>
    </div>
  </div>
  <div class="modal_bg"></div>
</template>

<style>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 1rem;
  z-index: 1000;
  display: grid;
  grid-template-columns: repeat(2, max-content);
  min-width: 25rem;
  min-height: 20rem;
  row-gap: 2.85rem;
  padding: 2rem;
  align-items: center;
  justify-content: center;
}

.modal__title {
  grid-row: 1 / 2;
  grid-column: 1 / 2;
}
.modal__title > h2 {
  font-size: 2rem;
  color: hsl(229, 25%, 31%);
  text-transform: uppercase;
}
.modal_content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  grid-row: 2 / 3;
  grid-column: 1 / 3;
}

.modal_bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.close {
  background-color: transparent;
  border: none;
  color: var(--gray-color);
  font-size: 1.5rem;
  cursor: pointer;
  width: 1.5rem;
  aspect-ratio: 1;
  background: url('../assets/icon-close.svg') no-repeat;
  grid-row: 1 / 2;
  grid-column: 2 / 3;
  order: unset;
  justify-self: flex-end;
}

@media screen and (max-width: 450px) {
  .modal {
    top: 0;
    left: 0;
    transform: translate(0px, 0px);
    min-width: unset;
    min-height: unset;
    row-gap: unset;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    padding: 0;
    border-radius: 0;
  }
  .close {
    order: 3;
  }
}
</style>
