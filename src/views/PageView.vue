<script setup lang="ts">

import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/user'
import { useDataStore } from '../stores/data'
import router from '@/router';

const location = useRoute()

// Get the stores
const userStore = useUserStore()
const dataStore = useDataStore()

</script>

<template>
  <main class="page-view">
    <section class="side-bar">
      <img src="../assets/logo.png" alt="Logo">
      <nav>
        <RouterLink to="/modules">Modules</RouterLink>
        <RouterLink to="/tips">Astuces</RouterLink>
        <RouterLink to="/accounts" v-if="userStore.isAdmin">Comptes</RouterLink>
      </nav>
    </section>
    <section class="content">
      <header>
        <div>
          <h1 class="title-text">UDSP59 FORMATION</h1>
          <h2 v-if="location.name == 'Module'" class="subtitle-text">{{ dataStore.module.title }}</h2>
        </div>
        <button class="disconnect-button" @click="userStore.logout()" title="Se déconnecter">
          <img src="../assets/disconnect.svg">
        </button>
      </header>

      <div class="actions">
        <button v-if="location.name == 'Module'" class="return-button" @click="router.back()" title="Revenir en arrière">
          <img src="../assets/chevron-left.svg">
        </button>
        <button class="add-button" @click="" title="Ajouter">
          <img src="../assets/add.svg">
        </button>
      </div>
      <router-view></router-view>
    </section>
  </main>
</template>

<style>
main.page-view {
  display: flex;
  flex-direction: row;
  height: 100svh;

  & section.side-bar {
    background-image: url('../assets/background.png'), linear-gradient(to bottom, rgba(208, 129, 60, 0.9), rgba(186, 22, 38, 0.9));
    background-position: center;
    background-size: cover;
    text-align: center;
    width: 18%;
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
        height: 4rem;
        width: 80%;
        color: var(--color-background);
        background: var(--color-primary);
        border: none;
        border-radius: 1rem;
        cursor: pointer;
        margin-bottom: 2rem;
        transition: all 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;

        &.router-link-active {
          font-size: 18pt;
          height: 6rem;
          background-color: var(--color-background);
          color: var(--color-secondary);
        }
      }
    }
  }

  & section.content {
    position: relative;
    width: 82%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 10rem 2rem 0 2rem;

    & header {
      height: 10rem;
      position: absolute;
      top: 0;
      width: 100%;
      padding: 2rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      & div {
        margin-left: 2rem;
        position: relative;

        & .subtitle-text {
          position: absolute;
          top: 3rem;
          color: var(--color-secondary);
        }
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

    & .actions {
      margin-bottom: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: row nowrap;
      gap: 1rem;

      & .add-button,
      & .return-button {
        background-color: var(--color-secondary);
        border: none;
        border-radius: 50%;
        padding: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        & img {
          height: 1.5rem;
          width: 1.5rem;
        }
      }
    }
  }
}
</style>