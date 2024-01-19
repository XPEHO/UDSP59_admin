<script setup lang="ts">
import { useDataStore } from "@/stores/data";
import { useRoute } from "vue-router";

// Get the datas store
const dataStore = useDataStore();

// Get the route
const route = useRoute();

// Properties of the component
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: false,
    default: -1,
  },
});

function getCardTitle() {
  if ("part" in route.params) {
    let module = dataStore.moduleEdited;
    let modulePart = module.parts[+route.params.part];
    let modulePartElement = modulePart.elements[props.index];
    return modulePartElement?.text;
  } else if ("id" in route.params) {
    let module = dataStore.moduleEdited;
    let modulePart = module.parts[props.index];
    return modulePart?.subtitle;
  } else {
    let module = dataStore.modulesEdited.get(props.id);
    return module?.title;
  }
}

function deleteCard() {
  if ("part" in route.params) {
    let module = dataStore.moduleEdited;
    let modulePart = module.parts[+route.params.part];
    modulePart.deleteElement(props.index);
    dataStore.checkModuleEdition();
  } else if ("id" in route.params) {
    dataStore.moduleEdited.deletePart(props.index);
    dataStore.checkModuleEdition();
  } else {
    dataStore.deleteModule(props.id);
  }
}

function getCardLink() {
  if ("elt" in route.params) {
    return "/module/" + route.params.id + "/" + route.params.part + "/" + props.index;
  } else if ("part" in route.params) {
    return "/module/" + route.params.id + "/" + route.params.part + "/" + props.index;
  } else if ("id" in route.params) {
    return "/module/" + route.params.id + "/" + props.index;
  } else {
    return "/module/" + props.id;
  }
}

function increaseOrder() {
  if ("part" in route.params) {
    let module = dataStore.moduleEdited;
    let modulePart = module.parts[+route.params.part];
    modulePart.increaseElementOrder(props.index);
    dataStore.checkModuleEdition();
  } else if ("id" in route.params) {
    dataStore.moduleEdited.increasePartOrder(props.index);
    dataStore.checkModuleEdition();
  } else {
    dataStore.increaseModuleOrder(props.id);
  }
}

function decreaseOrder() {
  if ("part" in route.params) {
    let module = dataStore.moduleEdited;
    let modulePart = module.parts[+route.params.part];
    modulePart.decreaseElementOrder(props.index);
    dataStore.checkModuleEdition();
  } else if ("id" in route.params) {
    dataStore.moduleEdited.decreasePartOrder(props.index);
    dataStore.checkModuleEdition();
  } else {
    dataStore.decreaseModuleOrder(props.id);
  }
}

function getCSSClasses() {
  let classes = "module-card";
  if ("part" in route.params) {
    classes += " module-part-elt-card";
  } else if ("id" in route.params) {
    classes += " module-part-card";
  }
  return classes;
}
</script>

<template>
  <div :class="getCSSClasses()">
    <div>
      <a
        href="javascript:void(0)"
        @click="increaseOrder"
        ><img src="../assets/svg/chevron-up.svg"
      /></a>
      <a
        href="javascript:void(0)"
        @click="decreaseOrder"
        ><img src="../assets/svg/chevron-down.svg"
      /></a>
    </div>
    <p>{{ getCardTitle() }}</p>
    <a
      href="javascript:void(0)"
      @click="deleteCard"
      ><img src="../assets/svg/delete.svg"
    /></a>
    <RouterLink :to="getCardLink()"><img src="../assets/svg/chevron-right.svg" /></RouterLink>
  </div>
</template>

<style>
.module-card {
  background-color: var(--color-primary-1);
  color: var(--color-background);
  padding: 1.2rem 2rem;
  border-radius: 1rem;
  width: 100%;
  box-shadow: 3px 3px 10px 1px rgb(0 0 0 / 40%);
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;

  &.module-part-card {
    background-color: var(--color-primary-2);
  }

  &.module-part-elt-card {
    background-color: var(--color-primary-3);
  }

  & div {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    & a img {
      height: 1.2rem;
      width: 1.2rem;
    }
  }

  & p {
    font-size: 15pt;
    width: 100%;
  }

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
</style>
