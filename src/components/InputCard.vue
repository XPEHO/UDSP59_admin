<script setup lang="ts">
import { useRoute } from "vue-router";

// Get the route
const route = useRoute();

// Properties of the component
defineProps({
  id: {
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
  value: {
    type: String,
    required: false,
  },
  action: {
    type: Function as unknown as () => (payload: Event) => void,
    required: false,
  },
});

function getCSSClasses() {
  let classes = "input-card";

  if ("elt" in route.params) {
    classes += " module-part-elt-input-card";
  } else if ("part" in route.params) {
    classes += " module-part-input-card";
  } else if ("id" in route.params) {
    classes += " module-input-card";
  }
  return classes;
}
</script>

<template>
  <div :class="getCSSClasses()">
    <label :for="id">{{ label }}</label>
    <input
      class="input-style"
      :type="type"
      :id="id"
      :name="id"
      :value="value"
      @input="action"
    />
  </div>
</template>

<style>
.input-card {
  background-color: var(--color-primary-1);
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

  &.module-input-card {
    background-color: var(--color-primary-2);
  }

  &.module-part-input-card {
    background-color: var(--color-primary-3);
  }

  &.module-part-elt-input-card {
    background-color: var(--color-primary-4);
  }

  & label {
    font-size: 15pt;
    white-space: nowrap;
  }

  & .input-style {
    width: 100%;
  }
}
</style>
