<script setup lang="ts">

import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/user'
import { useDataStore } from '../stores/data'
import router from '@/router';
import AddPopup from '@/components/AddPopup.vue';

// Get the stores
const userStore = useUserStore()
const dataStore = useDataStore()

// Get the route
const route = useRoute()

// Save to firebase
function saveToFirebase() {
  if (route.name == 'Modules') dataStore.saveModulesToFirebase()
  if (route.name == 'Tips') dataStore.saveTipsToFirebase()
}

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
          <h1 class="title-style">UDSP59 FORMATION</h1>
          <h2 v-if="route.path.includes('/module/')" class="subtitle-style">
            {{ (route.name == 'ModulePart' || route.name == 'ModulePartElement')
              ? (route.name == 'ModulePartElement')
                ? dataStore.module.title + '.' + ((+route.params.part) + 1) + '.' + ((+route.params.elt) + 1)
                : dataStore.module.title + '.' + ((+route.params.part) + 1)
              : dataStore.module.title
            }}
          </h2>
        </div>
        <button class="disconnect-button" @click="userStore.logout()" title="Se déconnecter">
          <img src="../assets/svg/disconnect.svg">
        </button>
      </header>

      <div class="actions">
        <button v-if="route.path.includes('/module/')" class="return-button" @click="router.back()"
          title="Revenir en arrière">
          <img src="../assets/svg/chevron-left.svg">
        </button>
        <button v-if="route.name !== 'ModulePartElement'" class="add-button" title="Ajouter">
          <img src="../assets/svg/add.svg">
        </button>
        <button v-if="dataStore.needToSave" class="save-button" @click="saveToFirebase" title="Enregistrer">
          <img src="../assets/svg/save.svg">
          <p>Enregistrer</p>
        </button>
      </div>
      <router-view></router-view>
    </section>
    <AddPopup v-if="route.name !== 'ModulePartElement'" />
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
        background: var(--color-primary-1);
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

        & .subtitle-style {
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
      & .return-button,
      & .save-button {
        background-color: var(--color-secondary);
        border: none;
        border-radius: 1.25rem;
        padding: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: var(--color-background);
        gap: 0.5rem;
        font-size: 15pt;

        & img {
          height: 1.5rem;
          width: 1.5rem;
        }
      }

      & .save-button {
        padding: 0.5rem 0.75rem;
      }
    }

    & main {
      padding: 1rem 1rem 2rem 1rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;
      gap: 1.5rem;
      width: 100%;
      height: 100%;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 0.25rem;
        background-color: rgba(0, 0, 0, 0.1);
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--color-primary-transparent);
        border-radius: 0.25rem;
      }
    }
  }
}
</style>