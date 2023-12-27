<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { onMounted, ref } from 'vue';
import Loader from '@/components/Loader.vue';

// Get the datas store
const dataStore = useDataStore()

// Load accounts from firebase before to display the view
const isLoading = ref(true);
onMounted(async () => {
  await dataStore.loadAccountsFromFirebase();
  isLoading.value = false;
});

</script>

<template>
  <Loader v-if="isLoading" />
  <main v-else>
    <p>accounts</p>
  </main>
</template>

<style></style>