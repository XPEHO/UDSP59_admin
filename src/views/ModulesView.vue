<script setup lang="ts">
import { useDataStore } from "@/stores/data";
import { onMounted, ref } from "vue";
import AppLoader from "@/components/AppLoader.vue";
import ModuleCard from "@/components/ModuleCard.vue";

// Get the datas store
const dataStore = useDataStore();

// Load modules from firebase before to display the view
const isLoading = ref(true);
onMounted(async () => {
  await dataStore.loadModulesFromFirebase();
  isLoading.value = false;
});
</script>

<template>
  <AppLoader v-if="isLoading" />
  <main v-else>
    <ModuleCard
      v-for="module in dataStore.getSortedModules()"
      :key="module.id"
      :id="module.id"
    />
  </main>
</template>

<style></style>
