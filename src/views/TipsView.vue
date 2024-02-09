<script setup lang="ts">
import { useDataStore } from "@/stores/data";
import { onMounted, ref } from "vue";
import AppLoader from "@/components/AppLoader.vue";
import TipCard from "@/components/TipCard.vue";

// Get the datas store
const dataStore = useDataStore();

// Load tips from firebase before to display the view
const isLoading = ref(true);
onMounted(async () => {
  await dataStore.loadTipsFromFirebase();
  isLoading.value = false;
});
</script>

<template>
  <AppLoader v-if="isLoading" />
  <main
    class="tips-view"
    v-else
  >
    <div v-if="dataStore.tipsEdited.length == 0">
      <p>Aucune astuce pour le moment.</p>
    </div>
    <TipCard
      v-else
      v-for="(tip, index) in dataStore.tipsEdited"
      :key="index"
      :index="index"
      :tip="tip"
    />
  </main>
</template>

<style>
main.tips-view {
  flex-flow: row wrap !important;
  justify-content: space-evenly !important;
  row-gap: 2rem !important;
}
</style>
