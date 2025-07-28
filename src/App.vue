<script setup lang="ts">
import { RouterView } from "vue-router";
import UnauthorizedAlertPopup from "@/components/UnauthorizedAlertPopup.vue";
</script>

<template>
  <RouterView />
  <UnauthorizedAlertPopup />
</template>

<style scoped></style>
