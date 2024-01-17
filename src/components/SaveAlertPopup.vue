<script lang="ts">
// Public access to show function
export const saveAlertPopup = reactive({
  continueChoice: null as boolean | null,
  show: () => { },
  setShowFunction(show: () => void) {
    this.show = show;
  }
});
</script>

<script setup lang="ts">

import { useDataStore } from '@/stores/data';
import { useRoute } from 'vue-router';
import { onMounted, reactive } from 'vue';

// Get the route
const route = useRoute()

// Get the datas store
const dataStore = useDataStore()

onMounted(() => {
  hide();
  let popupWrapper = document.querySelector('.popup-save-alert-wrapper') as HTMLElement;
  popupWrapper?.addEventListener('click', (e) => {
    if (e.target === popupWrapper) {
      cancel();
    }
  });
});

function hide() {
  let popupWrapper = document.querySelector('.popup-save-alert-wrapper') as HTMLElement;
  popupWrapper.style.display = 'none';
}

function show() {
  let popupWrapper = document.querySelector('.popup-save-alert-wrapper') as HTMLElement;
  popupWrapper.style.display = 'flex';
}

function cancel() {
  saveAlertPopup.continueChoice = false;
  hide();
}

function continueWithoutSave() {
  saveAlertPopup.continueChoice = true;
  hide();
}

saveAlertPopup.setShowFunction(show);

</script>

<template>
  <div class="popup-save-alert-wrapper">
    <div class="popup-save-alert">
      <h3 class="subtitle-style">Attention !</h3>
      <p>Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir continuer ?</p>
      <div class="popup-buttons">
        <button class="button-style" @click="cancel">Annuler</button>
        <button class="button-style-hook" @click="continueWithoutSave">Continuer</button>
      </div>
    </div>
  </div>
</template>

<style>
.popup-save-alert-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  & .popup-save-alert {
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

    & p {
      color: var(--color-primary-1);
      font-size: 15pt;
      text-align: center;
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