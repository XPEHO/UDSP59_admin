<script setup lang="ts">
import { useDataStore } from "@/stores/data";
import { onMounted, ref } from "vue";
import AppLoader from "@/components/AppLoader.vue";
import { useRoute } from "vue-router";
import ModuleCard from "@/components/ModuleCard.vue";
import InputModuleAttribute from "@/components/InputModuleAttribute.vue";

// Get the datas store
const dataStore = useDataStore();

// Get the route
const route = useRoute();

// Load module from firebase before to display the view
const isLoading = ref(true);
onMounted(async () => {
  dataStore.currentRoute = route;
  await dataStore.loadModuleFromFirebase(route.params.id as string);
  isLoading.value = false;
});

// Get current part
function getCurrentPart() {
  try {
    let currentPartIndex = +route.params.part;
    return dataStore.moduleEdited.parts[currentPartIndex];
  } catch (error) {
    return null;
  }
}

// Check if elements array is empty
function isElementsArrayEmpty(): boolean {
  try {
    return getCurrentPart()?.elements.length == 0;
  } catch (error) {
    return true;
  }
}
</script>

<template>
  <AppLoader v-if="isLoading" />
  <main
    v-else
    class="module-part-view"
  >
    <InputModuleAttribute
      attribute="subtitle"
      label="Titre :"
      type="text"
    />
    <InputModuleAttribute
      attribute="image"
      label="Image :"
      type="file"
    />
    <h2 class="subtitle-style">Elements de la partie du module :</h2>
    <div class="module-part-elt-list">
      <div v-if="isElementsArrayEmpty()">
        <p>Aucun éléments pour le moment.</p>
      </div>
      <ModuleCard
        v-else
        v-for="(modulePartElt, index) in getCurrentPart()?.elements"
        :key="index"
        :id="route.params.id as string"
        :index="index"
      />
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
