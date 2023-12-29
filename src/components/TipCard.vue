<script setup lang="ts">
import { Tip } from '@/models/Tip';
import { useDataStore } from '@/stores/data';

// Get the datas store
const dataStore = useDataStore();

// Properties of the component
defineProps({
  id: {
    type: String,
    required: true,
  },
  tip: {
    type: Tip,
    required: true,
  },
});

function focusTextarea(event: MouseEvent) {
  // Get the textarea and focus it
  let textarea = (event.target as HTMLElement).closest('.tip-card')?.querySelector('textarea') as HTMLTextAreaElement;
  textarea.focus();
  // Scroll to the bottom of the textarea and focus the end of the text
  textarea.scrollTop = textarea.scrollHeight;
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);
}

</script>

<template>
  <div class="tip-card">
    <textarea name="content">{{ tip.content }}</textarea>
    <div>
      <a href="javascript:void(0)" @click="focusTextarea"><img src="../assets/svg/edit.svg"></a>
      <a href="javascript:void(0)" @click="dataStore.deleteTip(id)"><img src="../assets/svg/delete.svg"></a>
    </div>
  </div>
</template>

<style>
.tip-card {
  background-color: var(--color-primary-1);
  color: var(--color-background);
  padding: 1.5rem;
  border-radius: 1rem;
  width: 20rem;
  height: 14rem;
  box-shadow: 3px 3px 10px 1px rgb(0 0 0 / 40%);
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  position: relative;

  & textarea {
    font-size: 14pt;
    width: 100%;
    height: 100%;
    resize: none;
    border: none;
    background: none;
    color: var(--color-background);

    &:focus {
      outline: none;
    }
  }

  & div {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    width: 100%;

    & a {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;

      & img {
        height: 1.5rem;
        width: 1.5rem;
      }
    }
  }
}
</style>