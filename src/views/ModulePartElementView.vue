<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { onMounted, ref } from 'vue';
import Loader from '@/components/Loader.vue';
import { useRoute } from 'vue-router';
import InputModuleAttribute from '@/components/InputModuleAttribute.vue';

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

</script>

<template>
  <Loader v-if="isLoading" />
  <main v-else class="module-part-elt-view">
    <InputModuleAttribute attribute="text" label="Texte :" type="text" />
    <InputModuleAttribute attribute="image" label="Image :" type="file" />
  </main>
</template>

<style></style>