<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { onMounted, ref } from 'vue';
import Loader from '@/components/Loader.vue';
import { useRoute } from 'vue-router';
import InputModulePartElementAttribute from '@/components/InputModulePartElementAttribute.vue';

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
  <main v-else class="module-part-elt-view">
    <InputModulePartElementAttribute attribute="text" label="Texte :" type="text" :part="+(route.params.part as string)"
      :elt="+(route.params.elt as string)" />
    <InputModulePartElementAttribute attribute="image" label="Image :" type="file" :part="+(route.params.part as string)"
      :elt="+(route.params.elt as string)" />
  </main>
</template>

<style></style>