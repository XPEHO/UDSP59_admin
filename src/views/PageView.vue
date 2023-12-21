<script setup lang="ts">

import { useUserStore } from '../stores/user'
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
      <section>
        <ModulesView v-if="location.path == '/modules'" />
        <TipsView v-if="location.path == '/tips'" />
        <AccountsView v-if="location.path == '/accounts'" />
      </section>
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
    flex: 0.18;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 2rem 0;

    & img {
      height: 25%;
      margin-bottom: 2rem;
    }

    & nav {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      & a {
        font-size: 15pt;
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
          font-size: 18pt;
          padding: 2rem 2rem;
          background-color: var(--color-background);
          color: var(--color-secondary);
        }
      }
    }
  }

  & section:last-child {
    position: relative;
    flex: 0.80;
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
      padding: 2rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      & .title-text {
        margin-left: 2rem;
      }

      & .disconnect-button {
        background: none;
        border: none;
        cursor: pointer;

        & img {
          height: 2rem;
          width: 2rem;
        }
      }
    }

    & .add-button {
      background-color: var(--color-secondary);
      border: none;
      border-radius: 50%;
      height: 2.5rem;
      width: 2.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin-bottom: 1rem;

      & img {
        height: 1.5rem;
        width: 1.5rem;
      }
    }

    & section {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>