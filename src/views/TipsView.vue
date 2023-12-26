<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { onMounted, ref } from 'vue';
import Loader from '@/components/Loader.vue';

const dataStore = useDataStore()

const isLoading = ref(true);
onMounted(async () => {
  await dataStore.loadTipsFromFirebase();
  isLoading.value = false;
});

</script>

<template>
  <Loader v-if="isLoading" />
  <main v-else>
    <p>tips</p>
  </main>
</template>