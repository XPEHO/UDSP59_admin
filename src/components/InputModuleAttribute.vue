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
    try {
      let modulePartIndex = +route.params.part
      let modulePart = dataStore.moduleEdited.parts[modulePartIndex]
      let modulePartElementIndex = +route.params.elt
      let modulePartElement = modulePart.elements[modulePartElementIndex]
      return modulePartElement[props.attribute]
    } catch (error) {
      return ''
    }
  } else if ('part' in route.params) {
    try {
      let modulePartIndex = +route.params.part
      let modulePart = dataStore.moduleEdited.parts[modulePartIndex]
      return modulePart[props.attribute]
    } catch (error) {
      return ''
    }
  } else if ('id' in route.params) {
    return dataStore.moduleEdited[props.attribute]
  } else {
    return ''
  }
}

function edit(e: Event) {
  let input = e.target as HTMLInputElement;
  if ('elt' in route.params) {
    let modulePartIndex = +route.params.part
    let modulePart = dataStore.moduleEdited.parts[modulePartIndex]
    let modulePartElementIndex = +route.params.elt
    let modulePartElement = modulePart.elements[modulePartElementIndex]
    modulePartElement[input.id] = input.value;
    dataStore.checkModuleEdition()
  } else if ('part' in route.params) {
    let modulePartIndex = +route.params.part
    let modulePart = dataStore.moduleEdited.parts[modulePartIndex]
    modulePart[input.id] = input.value;
    dataStore.checkModuleEdition()
  } else if ('id' in route.params) {
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

async function handleFileUpload(e: Event) {
  let file;
  let input = e.target as HTMLInputElement;

  // Check if the file is selected
  if (!input.files || input.files.length <= 0) {
    return
  }
  file = input.files[0];

  // Check if the file is an image
  if (!file.type.startsWith('image/')) {
    alert('Veuillez uploader une image.');
    return;
  }

  // Check if the file size is under 500KB
  if (file.size > 500 * 1024) {
    alert('Votre image est trop grande, elle doit faire moins de 500ko.');
    return;
  }

  // Keep the file
  if ('elt' in route.params) {
    let modulePartIndex = +route.params.part
    let modulePart = dataStore.moduleEdited.parts[modulePartIndex]
    let modulePartElementIndex = +route.params.elt
    let modulePartElement = modulePart.elements[modulePartElementIndex]
    modulePartElement.file = file;
    dataStore.checkModuleEdition()
  } else if ('part' in route.params) {
    let modulePartIndex = +route.params.part
    let modulePart = dataStore.moduleEdited.parts[modulePartIndex]
    modulePart.file = file;
    dataStore.checkModuleEdition()
  } else {
    dataStore.editModule("file", file);
  }

  // Preview the image
  await dataStore.loadImageUrl()
}

async function deleteImage() {
  if ('elt' in route.params) {
    let modulePartIndex = +route.params.part
    let modulePart = dataStore.moduleEdited.parts[modulePartIndex]
    let modulePartElementIndex = +route.params.elt
    let modulePartElement = modulePart.elements[modulePartElementIndex]
    if (modulePartElement.file) {
      modulePartElement.file = undefined;
    } else if (modulePartElement.image !== '') {
      modulePartElement.image = "";
    }
    dataStore.checkModuleEdition()
  } else if ('part' in route.params) {
    let modulePartIndex = +route.params.part
    let modulePart = dataStore.moduleEdited.parts[modulePartIndex]
    if (modulePart.file) {
      modulePart.file = undefined;
    } else if (modulePart.image !== '') {
      modulePart.image = "";
    }
    dataStore.checkModuleEdition()
  } else {
    if (dataStore.moduleEdited.file) {
      dataStore.editModule("file", undefined);
    } else if (dataStore.moduleEdited.image !== '') {
      dataStore.editModule("image", "");
    }
  }
  await dataStore.loadImageUrl()
}

</script>

<template>
  <div v-if="type == 'file'" :class="getCSSClasses()">
    <label for="image">{{ label }}</label>
    <input style="display: none;" type="file" id="image" name="image" @change="handleFileUpload" />
    <div class="image-choice">
      <img class="image-preview" v-if="dataStore.imageUrl !== ''" :src="dataStore.imageUrl" alt="image" />
      <p v-else>Aucune image</p>
      <div class="image-actions">
        <a v-if="dataStore.imageUrl !== ''" href="javascript:void(0)" @click="deleteImage"><img
            src="../assets/svg/delete.svg"></a>
        <label class="label-for-file" for="image">
          <img src="../assets/svg/upload.svg" title="Importer">
        </label>
      </div>
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

    & .image-actions {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      gap: 1.5rem;

      & a {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;

        & img {
          height: 1.8rem;
          width: 1.8rem;
        }
      }
    }

    & .image-preview {
      height: 6rem;
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