<script setup lang="ts">
import { unauthorizedAlertPopup } from "@/utilities/functions";
import { onMounted } from "vue";

onMounted(() => {
  hide();
  let popupWrapper = document.querySelector(".popup-unauthorized-alert-wrapper") as HTMLElement;
  popupWrapper?.addEventListener("click", (e) => {
    if (e.target === popupWrapper) {
      close();
    }
  });
});

function hide() {
  let popupWrapper = document.querySelector(".popup-unauthorized-alert-wrapper") as HTMLElement;
  if (popupWrapper) {
    popupWrapper.style.display = "none";
  }
}

function show() {
  let popupWrapper = document.querySelector(".popup-unauthorized-alert-wrapper") as HTMLElement;
  if (popupWrapper) {
    popupWrapper.style.display = "flex";
  }
}

unauthorizedAlertPopup.setShowFunction(show);
</script>

<template>
  <div class="popup-unauthorized-alert-wrapper">
    <div class="popup-unauthorized-alert">
      <h3 class="subtitle-style">Accès refusé</h3>
      <p>
        Votre compte n'est pas autorisé à accéder à cette application.<br /><br />
        Veuillez contacter un administrateur pour obtenir l'accès.
      </p>
      <button
        class="button-style-hook"
        @click="hide"
      >
        Fermer
      </button>
    </div>
  </div>
</template>

<style>
.popup-unauthorized-alert-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  & .popup-unauthorized-alert {
    width: 30rem;
    height: 20rem;
    background-color: var(--color-background);
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    & .subtitle-style {
      color: var(--color-secondary);
    }

    & p {
      color: var(--color-primary-1);
      font-size: 15pt;
      text-align: center;
      line-height: 1.4;
      margin: 0;
    }

    & .button-style-hook {
      background: var(--color-primary-1);
      font-size: 15pt;
      padding: 1rem 2rem;
      border: 2px solid var(--color-primary-1);
      border-radius: 10px;
      cursor: pointer;
      color: var(--color-background);
      transition: all 0.3s ease;

      &:hover {
        background: var(--color-secondary);
        border-color: var(--color-secondary);
      }
    }
  }
}
</style>
