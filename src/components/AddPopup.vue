<script setup lang="ts">
import { useDataStore } from "@/stores/data";
import InputCard from "@/components/InputCard.vue";
import { useRoute } from "vue-router";
import { onBeforeUnmount, onMounted } from "vue";
import { Module } from "@/models/Module";
import { ModulePart } from "@/models/ModulePart";
import { Account } from "@/models/Account";
import { ModulePartElement } from "@/models/ModulePartElement";

// Get the route
const route = useRoute();

// Get the datas store
const dataStore = useDataStore();

onMounted(() => {
  let popupWrapper = document.querySelector(".popup-add-wrapper") as HTMLElement;
  let addButton = document.querySelector(".add-button") as HTMLElement;
  hide();
  popupWrapper?.addEventListener("click", (e) => {
    if (e.target === popupWrapper) {
      hide();
    }
  });
  addButton?.addEventListener("click", show);
});

onBeforeUnmount(() => {
  let addButton = document.querySelector(".add-button") as HTMLElement;
  addButton?.removeEventListener("click", show);
});

function hide() {
  let popupWrapper = document.querySelector(".popup-add-wrapper") as HTMLElement;
  popupWrapper.style.display = "none";
}

function show() {
  let popupWrapper = document.querySelector(".popup-add-wrapper") as HTMLElement;
  popupWrapper.style.display = "flex";
  let input;
  if (route.name == "Tips") {
    input = document.querySelector(".popup-add #tipsToAdd") as HTMLTextAreaElement;
  } else if (route.name == "Accounts") {
    input = document.querySelector(".popup-add #mailToAdd") as HTMLInputElement;
  } else {
    input = document.querySelector(".popup-add #titleToAdd") as
      | HTMLInputElement
      | HTMLTextAreaElement;
  }
  input.focus();
}

function addModule() {
  let titleInput = document.querySelector(".popup-add #titleToAdd") as HTMLInputElement;
  let newOrder = dataStore.modulesEdited.size + 1;
  let module = new Module(
    titleInput.value,
    "",
    "",
    titleInput.value,
    newOrder,
    Array<ModulePart>(),
  );
  dataStore.addModule(module);
  titleInput.value = "";
  hide();
}

function addModulePart() {
  let titleInput = document.querySelector(".popup-add #titleToAdd") as HTMLInputElement;
  let modulePart = new ModulePart("", titleInput.value, Array<ModulePartElement>());
  dataStore.moduleEdited.addPart(modulePart);
  dataStore.checkModuleEdition();
  titleInput.value = "";
  hide();
}

function addModulePartElement() {
  let titleInput = document.querySelector(".popup-add #titleToAdd") as HTMLTextAreaElement;
  let modulePartElement = new ModulePartElement("", titleInput.value);
  let modulePart = dataStore.moduleEdited.parts[+route.params.part];
  modulePart.addElement(modulePartElement);
  dataStore.checkModuleEdition();
  titleInput.value = "";
  hide();
}

function addTip() {
  let tipInput = document.querySelector(".popup-add #tipsToAdd") as HTMLTextAreaElement;
  let tip = tipInput.value;
  dataStore.addTip(tip);
  tipInput.value = "";
  hide();
}

function addAccount() {
  let mailInput = document.querySelector(".popup-add #mailToAdd") as HTMLInputElement;
  let account = new Account(mailInput.value, false);
  dataStore.addAccount(account);
  mailInput.value = "";
  hide();
}

function add() {
  if (route.name == "Modules") {
    addModule();
  } else if (route.name == "Tips") {
    addTip();
  } else if (route.name == "Accounts") {
    addAccount();
  } else if ("part" in route.params) {
    addModulePartElement();
  } else if ("id" in route.params) {
    addModulePart();
  }
}

function getPopupTitle() {
  if (route.name == "Modules") {
    return "Ajouter un module";
  } else if (route.name == "Tips") {
    return "Ajouter une astuce";
  } else if (route.name == "Accounts") {
    return "Ajouter un compte";
  } else if ("part" in route.params) {
    return "Ajouter un élément";
  } else if ("id" in route.params) {
    return "Ajouter une partie";
  }
}
</script>

<template>
  <div class="popup-add-wrapper">
    <div class="popup-add">
      <h3 class="subtitle-style">{{ getPopupTitle() }}</h3>
      <div
        v-if="route.name == 'Tips'"
        class="text-area-card"
      >
        <textarea id="tipsToAdd"></textarea>
      </div>
      <InputCard
        v-else-if="route.name == 'Accounts'"
        id="mailToAdd"
        label="Email :"
        type="email"
      />
      <div
        v-else-if="'part' in route.params"
        class="text-area-card"
      >
        <textarea id="titleToAdd"></textarea>
      </div>
      <InputCard
        v-else
        id="titleToAdd"
        label="Titre :"
        type="text"
      />
      <div class="popup-buttons">
        <button
          class="button-style"
          @click="hide"
        >
          Annuler
        </button>
        <button
          class="button-style-hook"
          @click="add"
        >
          Ajouter
        </button>
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

    &:has(textarea#titleToAdd) {
      width: 40rem;
      height: 30rem;
    }

    &:has(textarea#tipsToAdd) {
      width: 33rem;
      height: 23rem;
    }

    & .text-area-card {
      background-color: var(--color-primary-1);
      color: var(--color-background);
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 1rem;
      width: 100%;
      height: 100%;
      box-shadow: 3px 3px 10px 1px rgb(0 0 0 / 40%);

      &:has(#titleToAdd) {
        background-color: var(--color-primary-3);
      }

      & textarea {
        font-size: 14pt;
        width: 100%;
        height: 100%;
        resize: none;
        border: none;
        background: none;
        color: var(--color-background);

        &::-webkit-scrollbar {
          width: 0.25rem;
          height: 0.25rem;
          border-radius: 0.12rem;
          background-color: rgba(255, 255, 255, 0.15);
        }

        &::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 0.12rem;
        }

        &:focus {
          outline: none;
        }
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
