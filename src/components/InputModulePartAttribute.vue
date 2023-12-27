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
  part: {
    type: Number,
    required: true,
  },
});

</script>

<template>
  <div v-if="type !== 'file'" class="input-module-part-attribute">
    <label :for="attribute">{{ label }}</label>
    <input class="input-style" :type="type" :id="attribute" :name="attribute"
      :value="dataStore.module.parts[part][attribute]" />
  </div>
  <div v-else class="input-module-part-attribute">
    <label :for="attribute">{{ label }}</label>
    <input class="input-style" style="display: none;" :type="type" :id="attribute" :name="attribute"
      :value="dataStore.module.parts[part][attribute]" />
    <label class="label-for-file" :for="attribute">
      <img src="../assets/svg/upload.svg">
      <span>Choisir un fichier</span>
    </label>
  </div>
</template>

<style>
.input-module-part-attribute {
  background-color: var(--color-primary-3);
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
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      gap: 1rem;
      cursor: pointer;

      & img {
        height: 1.8rem;
        width: 1.8rem;
      }
    }
  }

  & .input-style {
    width: 100%;
  }
}
</style>