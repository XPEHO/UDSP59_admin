<script setup lang="ts">

import { useDataStore } from '@/stores/data';
import { useRoute } from 'vue-router';
import { onBeforeUnmount, onMounted } from 'vue';
import { useMaterialIconsStore } from '@/stores/material-icons';

// Get the route
const route = useRoute()

// Get the datas stores
const dataStore = useDataStore()
const materialIconsStore = useMaterialIconsStore()

onMounted(() => {
  let popupWrapper = document.querySelector('.popup-picker-wrapper') as HTMLElement;
  let pickerButton = document.querySelector('.picker-button') as HTMLElement;
  hide();
  popupWrapper?.addEventListener('click', (e) => {
    if (e.target === popupWrapper) {
      hide();
    }
  });
  pickerButton?.addEventListener('click', show);
});

onBeforeUnmount(() => {
  let pickerButton = document.querySelector('.picker-button') as HTMLElement;
  pickerButton?.removeEventListener('click', show);
});

function hide() {
  let popupWrapper = document.querySelector('.popup-picker-wrapper') as HTMLElement;
  popupWrapper.style.display = 'none';
}

function show() {
  let popupWrapper = document.querySelector('.popup-picker-wrapper') as HTMLElement;
  popupWrapper.style.display = 'flex';
  let searchInput = document.querySelector('.search-box input') as HTMLInputElement;
  searchInput.focus();
}

function search(e: Event) {
  let searchInput = e.target as HTMLInputElement;
  let searchValue = searchInput.value;
  materialIconsStore.search(searchValue);
}

function selectIcon(icon: string) {
  hide();
}

</script>

<template>
  <div class="popup-picker-wrapper">
    <div class="popup-picker">
      <h3 class="subtitle-style">Choisir une icone</h3>
      <div class="search-box">
        <input type="text" @input="search">
        <img src="../assets/svg/search.svg" alt="Search Icon">
      </div>
      <div class="icon-list">
        <div v-for="icon in materialIconsStore.getSearchedIcons" class="icon-item" @click="selectIcon(icon)">
          <i class="material-icons" :title="icon">{{ icon }}</i>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.popup-picker-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  & .popup-picker {
    width: 30rem;
    height: 40rem;
    background-color: var(--color-background);
    border-radius: 10px;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    gap: 1rem;

    & .subtitle-style {
      color: var(--color-secondary);
    }

    & .search-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 3rem;

      & input {
        width: 100%;
        height: 2rem;
        border: none;
        border-bottom: 1px solid var(--color-primary-1);
        outline: none;
        background-color: transparent;
        color: var(--color-primary-1);
        font-size: 15pt;
        line-height: 125%;
      }

      & img {
        height: 2rem;
        padding-bottom: 0.3rem;
        padding-top: 0.3rem;
        border-bottom: 1px solid var(--color-primary-1);
      }
    }

    & .icon-list {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      align-content: flex-start;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 0.25rem;
        background-color: rgba(0, 0, 0, 0.1);
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--color-primary-transparent);
        border-radius: 0.25rem;
      }

      & .icon-item {
        width: 3rem;
        height: 3rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }

        & i {
          font-size: 2.5rem;
          color: var(--color-primary-1);
        }
      }
    }
  }
}
</style>