<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { onMounted, ref } from 'vue';
import Loader from '@/components/Loader.vue';
import ModuleCard from '@/components/ModuleCard.vue';
import { Module } from '@/models/Module';

const dataStore = useDataStore()

const isLoading = ref(true);
onMounted(async () => {
  await dataStore.loadModulesFromFirebase();
  isLoading.value = false;
});

</script>

<template>
  <Loader v-if="isLoading" />
  <main v-else>
    <ModuleCard v-for="[id, module] in dataStore.modules" :id="id" :module="module" />
  </main>
</template>

<style></style>