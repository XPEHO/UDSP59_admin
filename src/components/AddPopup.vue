<script setup lang="ts">

import { useDataStore } from '@/stores/data';
import InputModuleAttribute from '@/components/InputModuleAttribute.vue';
import { useRoute } from 'vue-router';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Module } from '@/models/Module';
import { ModulePart } from '@/models/ModulePart';

// Get the route
const route = useRoute()

// Get the datas store
const dataStore = useDataStore()

onMounted(() => {
  const popupWrapper = document.querySelector('.popup-add-wrapper') as HTMLElement;
  const addButton = document.querySelector('.add-button') as HTMLElement;
  hide();
  popupWrapper?.addEventListener('click', (e) => {
    if (e.target === popupWrapper) {
      hide();
    }
  });
  addButton?.addEventListener('click', show);
});

onBeforeUnmount(() => {
  const addButton = document.querySelector('.add-button') as HTMLElement;
  addButton?.removeEventListener('click', show);
});

function hide() {
  (document.querySelector('.popup-add-wrapper') as HTMLElement).style.display = 'none';
}

function show() {
  (document.querySelector('.popup-add-wrapper') as HTMLElement).style.display = 'flex';
  if (route.name == 'Modules') {
    (document.querySelector('.popup-add.popup-modules .input-module-attribute #title') as HTMLInputElement).focus();
  }
}

function addModule() {
  let module = new Module("", "", (document.querySelector('.popup-add.popup-modules .input-module-attribute #title') as HTMLInputElement).value, Array<ModulePart>());
  dataStore.addModule(module);
  (document.querySelector('.popup-add.popup-modules .input-module-attribute #title') as HTMLInputElement).value = "";
  hide();
}

function addTip() {
  let tip = (document.querySelector('.popup-add.popup-tips textarea') as HTMLTextAreaElement).value;
  dataStore.addTip(tip);
  (document.querySelector('.popup-add.popup-tips textarea') as HTMLTextAreaElement).value = "";
  hide();
}

</script>

<template>
  <div class="popup-add-wrapper">
    <div v-if="route.name == 'Modules'" class="popup-add popup-modules">
      <h3 class="subtitle-style">Ajouter un module</h3>
      <InputModuleAttribute attribute="title" label="Titre :" type="text" />
      <div class="popup-buttons">
        <button class="button-style" @click="hide">Annuler</button>
        <button class="button-style-hook" @click="addModule">Ajouter</button>
      </div>
    </div>
    <div v-if="route.name == 'Tips'" class="popup-add popup-tips">
      <h3 class="subtitle-style">Ajouter une astuce</h3>
      <textarea name="content"></textarea>
      <div class="popup-buttons">
        <button class="button-style" @click="hide">Annuler</button>
        <button class="button-style-hook" @click="addTip">Ajouter</button>
      </div>
    </div>
  </div>
</template>

<style>
.popup-add-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  & .popup-add {
    width: 30rem;
    height: 20rem;
    background-color: var(--color-background);
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    & .subtitle-style {
      color: var(--color-secondary);
    }

    & .input-module-attribute {
      background-color: var(--color-primary-1);
    }

    & textarea {
      width: 100%;
      height: 100%;
      resize: none;
      border: 1px solid var(--color-primary-1);
      background: none;
      color: var(--color-primary-1);
      font-size: 14pt;
      margin: 1rem 0;

      &:focus {
        outline: none;
      }
    }

    & .popup-buttons {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      gap: 2rem;

      & .button-style {
        background: none;
        font-size: 15pt;
        padding: 1rem 2rem;
        border: 2px solid var(--color-primary-1);
        border-radius: 10px;
        cursor: pointer;
        color: var(--color-primary-1);
      }

      & .button-style-hook,
      & .button-style:hover {
        background: var(--color-primary-1);
        font-size: 15pt;
        padding: 1rem 2rem;
        border: 2px solid var(--color-primary-1);
        border-radius: 10px;
        cursor: pointer;
        color: var(--color-background);
      }
    }

  }
}
</style>