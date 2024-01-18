<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { onMounted, ref } from 'vue';
import Loader from '@/components/Loader.vue';
import { useRoute } from 'vue-router';
import ModuleCard from '@/components/ModuleCard.vue';
import InputModuleAttribute from '@/components/InputModuleAttribute.vue';
import MaterialIconPicker from '@/components/MaterialIconPicker.vue';

// Get the datas store
const dataStore = useDataStore()

// Get the route
const route = useRoute();

// Load module from firebase before to display the view
const isLoading = ref(true);
onMounted(async () => {
  dataStore.currentRoute = route;
  await dataStore.loadModuleFromFirebase(route.params.id as string);
  isLoading.value = false;
});


// Check if parts array is empty
function isPartsArrayEmpty(): boolean {
  return dataStore.moduleEdited.parts?.length == 0;
}

</script>

<template>
  <Loader v-if="isLoading" />
  <main v-else class="module-view">
    <InputModuleAttribute attribute="title" label="Titre :" type="text" />
    <InputModuleAttribute attribute="image" label="Image :" type="file" />
    <InputModuleAttribute attribute="icon" label="Icône :" type="picker" />
    <h2 class="subtitle-style">Parties du module :</h2>
    <div class="module-part-list">
      <div v-if="isPartsArrayEmpty()">
        <p>Aucune partie pour le moment.</p>
      </div>
      <ModuleCard v-else v-for="(modulePart, index) in dataStore.moduleEdited.parts" :id="(route.params.id as string)"
        :index="index" />
    </div>
    <MaterialIconPicker />
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