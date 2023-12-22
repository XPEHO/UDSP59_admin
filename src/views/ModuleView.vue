<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { onMounted, ref } from 'vue';
import Loader from '@/components/Loader.vue';
import { useRoute } from 'vue-router';
import ModulePartCard from '@/components/ModulePartCard.vue';

const dataStore = useDataStore()
const route = useRoute();

const isLoading = ref(true);
onMounted(async () => {
  await dataStore.loadModuleFromFirebase(route.params.id as string);
  isLoading.value = false;
});

</script>

<template>
  <main class="module-view">
    <Loader v-if="isLoading" />
    <ModulePartCard v-else v-for="(modulePart, index) in dataStore.module.parts" :id="(route.params.id as string)"
      :modulePart="modulePart" :index="index" />
  </main>
</template>

<style>
main.module-view {
  padding: 1rem 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>