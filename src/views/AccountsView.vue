<script setup lang="ts">
import { useDataStore } from "@/stores/data";
import { onMounted, ref } from "vue";
import AppLoader from "@/components/AppLoader.vue";
import AccountCard from "@/components/AccountCard.vue";

// Get the datas store
const dataStore = useDataStore();

// Load accounts from firebase before to display the view
const isLoading = ref(true);
onMounted(async () => {
  await dataStore.loadAccountsFromFirebase();
  isLoading.value = false;
});
</script>

<template>
  <AppLoader v-if="isLoading" />
  <main
    class="accounts-view"
    v-else
  >
    <div v-if="dataStore.accountsEdited.size == 0">
      <p>Aucun compte pour le moment.</p>
    </div>
    <AccountCard
      v-else
      v-for="[id, account] in dataStore.accountsEdited"
      :key="id"
      :id="id"
      :account="account"
    />
  </main>
</template>

<style>
main.accounts-view {
  flex-flow: row wrap !important;
  justify-content: space-evenly !important;
  row-gap: 2rem !important;
}
</style>
