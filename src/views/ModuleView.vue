<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { onMounted, ref } from 'vue';
import Loader from '@/components/Loader.vue';
import { useRoute } from 'vue-router';
import ModulePartCard from '@/components/ModulePartCard.vue';
import InputModuleAttribute from '@/components/InputModuleAttribute.vue';
import type { ModulePart } from '@/models/ModulePart';

// Get the datas store
const dataStore = useDataStore()

// Get the route
const route = useRoute();

// Load module from firebase before to display the view
const isLoading = ref(true);
onMounted(async () => {
  await dataStore.loadModuleFromFirebase(route.params.id as string);
  isLoading.value = false;
});

</script>

<template>
  <Loader v-if="isLoading" />
  <main v-else class="module-view">
    <InputModuleAttribute attribute="title" label="Titre :" type="text" />
    <InputModuleAttribute attribute="image" label="Image :" type="file" />
    <InputModuleAttribute attribute="icon" label="Icône :" type="text" />
    <h2 class="subtitle-style">Parties du module :</h2>
    <div class="module-part-list">
      <div v-if="dataStore.module.parts.length == 0">
        <p>Aucune partie pour le moment.</p>
      </div>
      <ModulePartCard v-else v-for="(modulePart, index) in dataStore.module.parts" :id="(route.params.id as string)"
        :modulePart="modulePart" :index="index" />
    </div>
  </main>
</template>

<style>
main.module-view {
  & .subtitle-style {
    color: var(--color-primary-1);
  }

  & .module-part-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }
}
</style>