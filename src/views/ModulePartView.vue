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

// Get module part elements
const modulePartElts = dataStore.module.parts[+route.params.part].elements;

</script>

<template>
  <Loader v-if="isLoading" />
  <main v-else class="module-part-view">
    <InputModulePartAttribute attribute="subtitle" label="Titre :" type="text" :part="+(route.params.part as string)" />
    <InputModulePartAttribute attribute="image" label="Image :" type="file" :part="+(route.params.part as string)" />
    <h2 class="subtitle-style">Elements de la partie du module :</h2>
    <div class="module-part-elt-list">
      <ModulePartElementCard v-for="(modulePartElt, index) in modulePartElts" :id="(route.params.id as string)"
        :modulePartElt="modulePartElt" :index="index" />
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