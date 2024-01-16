<script setup lang="ts">

import InputCard from '@/components/InputCard.vue';
import { useDataStore } from '@/stores/data';
import { useRoute } from 'vue-router';

// Get the datas store
const dataStore = useDataStore()

// Get the route
const route = useRoute()

// Properties of the component
const props = defineProps({
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

function getAttributeValue() {
  if ('elt' in route.params) {
    let module = dataStore.moduleEdited
    let modulePart = module.parts[+route.params.part]
    let modulePartElement = modulePart.elements[+route.params.elt]
    return modulePartElement[props.attribute]
  } else if ('part' in route.params) {
    let module = dataStore.moduleEdited
    let modulePart = module.parts[+route.params.part]
    return modulePart[props.attribute]
  } else if ('id' in route.params) {
    return dataStore.moduleEdited[props.attribute]
  } else {
    return ''
  }
}

function edit(e: Event) {
  if ('elt' in route.params) {

  } else if ('part' in route.params) {

  } else if ('id' in route.params) {
    let input = e.target as HTMLInputElement;
    dataStore.editModule(input.id, input.value);
  }
}

function getCSSClasses() {
  let classes = 'input-module-attribute'

  if ('elt' in route.params) {
    classes += ' input-module-part-elt-attribute'
  } else if ('part' in route.params) {
    classes += ' input-module-part-attribute'
  }
  return classes
}

</script>

<template>
  <div v-if="type == 'file'" :class="getCSSClasses()">
    <label for="image">{{ label }}</label>
    <input style="display: none;" type="file" id="image" name="image" :value="getAttributeValue()" />
    <div class="image-choice">
      <img v-if="getAttributeValue() !== ''" :src="getAttributeValue()" alt="image" />
      <p v-else>Aucune image</p>
      <label class="label-for-file" for="image">
        <img src="../assets/svg/upload.svg" title="Importer">
      </label>
    </div>
  </div>
  <div v-else-if="type == 'picker'" :class="getCSSClasses()">
    <label for="icon">{{ label }}</label>
    <input type="hidden" id="icon" name="icon" :value="getAttributeValue()" />
    <div class="icon-choice">
      <i v-if="getAttributeValue() !== ''" class="material-icons" :title="getAttributeValue()">{{
        getAttributeValue() }}</i>
      <p v-else>Aucune Icône</p>
      <a class="picker-button" href="javascript:void(0)"><img src="../assets/svg/edit.svg" title="Modifier"
          alt="edit"></a>
    </div>
  </div>
  <InputCard v-else :id="attribute" :label="label" :type="type" :value="getAttributeValue()" :action="edit" />
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

  &.input-module-part-attribute {
    background-color: var(--color-primary-3);
  }

  &.input-module-part-elt-attribute {
    background-color: var(--color-primary-4);
  }

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