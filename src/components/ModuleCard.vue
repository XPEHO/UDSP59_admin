<script setup lang="ts">
import { Module } from '../models/Module';
import { useDataStore } from '@/stores/data';

// Get the datas store
const dataStore = useDataStore();

// Properties of the component
defineProps({
  id: {
    type: String,
    required: true,
  },
  module: {
    type: Module,
    required: true,
  },
});

</script>

<template>
  <div class="module-card">
    <p>{{ module.title }}</p>
    <a href="javascript:void(0)" @click="dataStore.deleteModule(id)"><img src="../assets/svg/delete.svg"></a>
    <RouterLink :to="'/module/' + id"><img src="../assets/svg/chevron-right.svg"></RouterLink>
  </div>
</template>

<style>
.module-card {
  background-color: var(--color-primary-1);
  color: var(--color-background);
  padding: 1.2rem 2rem;
  border-radius: 1rem;
  width: 100%;
  box-shadow: 3px 3px 10px 1px rgb(0 0 0 / 40%);
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;

  & p {
    font-size: 15pt;
    width: 100%;
  }

  & a {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    & img {
      height: 1.8rem;
      width: 1.8rem;
    }
  }
}
</style>