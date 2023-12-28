<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { onMounted, ref } from 'vue';
import Loader from '@/components/Loader.vue';
import TipCard from '@/components/TipCard.vue';

// Get the datas store
const dataStore = useDataStore()

// Load tips from firebase before to display the view
const isLoading = ref(true);
onMounted(async () => {
  await dataStore.loadTipsFromFirebase();
  isLoading.value = false;
});

</script>

<template>
  <Loader v-if="isLoading" />
  <main class="tips-view" v-else>
    <TipCard v-for="[id, tip] in dataStore.tips" :id="id" :tip="tip" />
  </main>
</template>

<style>
main.tips-view {
  flex-flow: row wrap !important;
  justify-content: space-evenly !important;
  row-gap: 2rem !important;
}
</style>