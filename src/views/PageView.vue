<script setup lang="ts">

import { ref } from 'vue';
import GoogleButton from '../components/GoogleButton.vue'
import { useUserStore } from '../stores/user'
import router from '@/router';
import { useRoute } from 'vue-router'
import ModulesView from './ModulesView.vue';
import TipsView from './TipsView.vue';

// Get the current route
const location = useRoute();

// Get the stores
const userStore = useUserStore()

</script>

<template>
  <button class="google-button" @click="userStore.logout()">
    <img src="../assets/google-logo.png" alt="Google logo">
    <span>Se déconnecter</span>
  </button>
  <button class="button-text" @click="router.push('/modules')">Modules</button>
  <button class="button-text" @click="router.push('/tips')">Tips</button>
  <ModulesView v-if="location.path == '/modules'" />
  <TipsView v-if="location.path == '/tips'" />
</template>

<style></style>