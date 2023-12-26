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
    <ModuleCard v-for="i in 10" id="epSoxnoj0aqJJ5ORenzE"
      :module="(dataStore.getModules.get('epSoxnoj0aqJJ5ORenzE') as Module)" />
  </main>
</template>

<style></style>