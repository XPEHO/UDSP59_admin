<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  const loader: HTMLElement | null = document.querySelector(".loader");

  setTimeout(() => {
    if (loader) {
      loader.style.display = "block";
    }
  }, 500);
});

</script>

<template>
  <div class="loader-wrapper">
    <div class="loader"></div>
  </div>
</template>

<style>
.loader-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  & .loader {
    display: none;
    border: 5px solid;
    border-color: var(--color-secondary) transparent var(--color-secondary) transparent;
    border-radius: 50%;
    height: 100px;
    width: 100px;
    animation: spin 1s linear infinite;
  }
}


@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>