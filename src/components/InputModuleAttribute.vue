<script setup lang="ts">

import { useDataStore } from '@/stores/data';

// Get the datas store
const dataStore = useDataStore()

// Properties of the component
defineProps({
  attribute: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

</script>

<template>
  <div v-if="type == 'file'" class="input-module-attribute">
    <label :for="attribute">{{ label }}</label>
    <input style="display: none;" :type="type" :id="attribute" :name="attribute" :value="dataStore.module[attribute]" />
    <div class="image-choice">
      <img v-if="dataStore.module[attribute] !== ''" :src="dataStore.module[attribute]" alt="image" />
      <p v-else>Aucune image</p>
      <label class="label-for-file" :for="attribute">
        <img src="../assets/svg/upload.svg" title="Importer">
      </label>
    </div>
  </div>
  <div v-else-if="type == 'picker'" class="input-module-attribute">
    <label :for="attribute">{{ label }}</label>
    <input type="hidden" :id="attribute" :name="attribute" :value="dataStore.module[attribute]" />
    <div class="icon-choice">
      <i v-if="dataStore.module[attribute] !== ''" class="material-icons" :title="dataStore.module[attribute]">{{
        dataStore.module[attribute] }}</i>
      <p v-else>Aucune Icône</p>
      <a class="picker-button" href="javascript:void(0)"><img src="../assets/svg/edit.svg" title="Modifier"
          alt="edit"></a>
    </div>
  </div>
  <div v-else class="input-module-attribute">
    <label :for="attribute">{{ label }}</label>
    <input class="input-style" :type="type" :id="attribute" :name="attribute" :value="dataStore.module[attribute]" />
  </div>
</template>

<style>
.input-module-attribute {
  background-color: var(--color-primary-2);
  color: var(--color-background);
  padding: 1.2rem 2rem;
  border-radius: 1rem;
  width: 100%;
  box-shadow: 3px 3px 10px 1px rgb(0 0 0 / 40%);
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;

  & label {
    font-size: 15pt;
    white-space: nowrap;

    &.label-for-file {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      & img {
        height: 1.8rem;
        width: 1.8rem;
      }
    }
  }

  & .image-choice {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;

    & p {
      font-size: 15pt;
    }

    & img {
      height: 4rem;
      width: 4rem;
      object-fit: contain;
    }
  }

  & .input-style {
    width: 100%;
  }

  & .icon-choice {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;

    & p {
      font-size: 15pt;
    }

    & .material-icons {
      font-size: 24pt;
    }

    & .picker-button {
      cursor: pointer;
      color: var(--color-background);
      font-size: 15pt;
      display: flex;
      justify-content: center;
      align-items: center;

      & img {
        height: 1.8rem;
        width: 1.8rem;
      }
    }
  }
}
</style>