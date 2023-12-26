<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { onMounted, ref } from 'vue';
import Loader from '@/components/Loader.vue';
import { useRoute } from 'vue-router';
import ModulePartCard from '@/components/ModulePartCard.vue';
import InputModuleAttribute from '@/components/InputModuleAttribute.vue';
import type { ModulePart } from '@/models/ModulePart';

const dataStore = useDataStore()
const route = useRoute();

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
    <div class="module-list">
      <ModulePartCard v-for="(modulePart, index) in dataStore.module.parts" :id="(route.params.id as string)"
        :modulePart="modulePart" :index="index" />
      <ModulePartCard v-for="i in 10" id="epSoxnoj0aqJJ5ORenzE" :modulePart="(dataStore.getModule.parts[0] as ModulePart)"
        :index="0" />
    </div>
  </main>
</template>

<style>
main.module-view {
  & .subtitle-style {
    color: var(--color-primary);
  }

  & .module-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }
}
</style>