<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { onMounted, ref } from 'vue';
import Loader from '@/components/Loader.vue';
import { useRoute } from 'vue-router';
import ModulePartElementCard from '@/components/ModulePartElementCard.vue';
import InputModulePartAttribute from '@/components/InputModulePartAttribute.vue';

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

// Check if elements array is empty
function isElementsArrayEmpty(): boolean {
  let currentPartIndex = +route.params.part;
  let currentPart = dataStore.module.parts[currentPartIndex];
  return currentPart.elements.length == 0;
}

</script>

<template>
  <Loader v-if="isLoading" />
  <main v-else class="module-part-view">
    <InputModulePartAttribute attribute="subtitle" label="Titre :" type="text" :part="+(route.params.part as string)" />
    <InputModulePartAttribute attribute="image" label="Image :" type="file" :part="+(route.params.part as string)" />
    <h2 class="subtitle-style">Elements de la partie du module :</h2>
    <div class="module-part-elt-list">
      <div v-if="isElementsArrayEmpty()">
        <p>Aucun éléments pour le moment.</p>
      </div>
      <ModulePartElementCard v-else v-for="(modulePartElt, index) in dataStore.module.parts[+route.params.part].elements"
        :id="(route.params.id as string)" :modulePartElt="modulePartElt" :index="index" />
    </div>
  </main>
</template>

<style>
main.module-part-view {
  & .subtitle-style {
    color: var(--color-primary-1);
  }

  & .module-part-elt-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }
}
</style>