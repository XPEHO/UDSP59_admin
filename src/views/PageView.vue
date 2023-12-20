<script setup lang="ts">

import { useUserStore } from '../stores/user'
import router from '@/router';
import { useRoute } from 'vue-router'
import ModulesView from './ModulesView.vue';
import TipsView from './TipsView.vue';
import AccountsView from './AccountsView.vue';

// Get the current route
const location = useRoute();

// Get the stores
const userStore = useUserStore()

</script>

<template>
  <main class="page-view">
    <section>
      <img src="../assets/logo.png" alt="Logo">
      <nav>
        <RouterLink to="/modules">Modules</RouterLink>
        <RouterLink to="/tips">Astuces</RouterLink>
        <RouterLink to="/accounts" v-if="userStore.isAdmin">Comptes</RouterLink>
      </nav>
    </section>
    <section>
      <header>
        <h1 class="title-text">UDSP59 FORMATION</h1>
        <button class="disconnect-button" @click="userStore.logout()" title="Se déconnecter">
          <img src="../assets/disconnect.svg">
        </button>
      </header>

      <button class="add-button" @click="" title="Ajouter">
        <img src="../assets/add.svg">
      </button>
      <ModulesView v-if="location.path == '/modules'" />
      <TipsView v-if="location.path == '/tips'" />
      <AccountsView v-if="location.path == '/accounts'" />
    </section>
  </main>
</template>

<style>
main.page-view {
  display: flex;
  flex-direction: row;
  height: 100svh;

  & section:first-child {
    background-image: url('../assets/background.png'), linear-gradient(to bottom, rgba(208, 129, 60, 0.9), rgba(186, 22, 38, 0.9));
    background-position: center;
    background-size: cover;
    text-align: center;
    flex: 0.25;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 2rem 0;

    & img {
      height: 30%;
      margin-bottom: 2rem;
    }

    & nav {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      & a {
        font-size: 28pt;
        font-weight: bold;
        padding: 1rem 2rem;
        width: 80%;
        color: var(--color-background);
        background: var(--color-text);
        border: none;
        border-radius: 1rem;
        cursor: pointer;
        margin-bottom: 2rem;
        transition: all 0.3s ease;

        &.router-link-active {
          padding: 2rem 2rem;
          background-color: var(--color-background);
          color: var(--color-secondary);
        }
      }
    }
  }

  & section:last-child {
    position: relative;
    flex: 0.75;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 10rem 2rem 2rem 2rem;

    & header {
      height: 10rem;
      position: absolute;
      top: 0;
      width: 100%;
      padding: 2rem 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      & .title-text {
        margin-left: 1rem;
      }

      & .disconnect-button {
        background: none;
        border: none;
        cursor: pointer;

        & img {
          height: 3rem;
          width: 3rem;
        }
      }
    }

    & .add-button {
      background-color: var(--color-secondary);
      border: none;
      border-radius: 50%;
      height: 4rem;
      width: 4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin-bottom: 1rem;

      & img {
        height: 3rem;
        width: 3rem;
      }
    }
  }
}
</style>