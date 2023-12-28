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

</script>

<template>
    <div class="tip-card">
        <textarea name="content">{{ tip.content }}</textarea>
        <a href="javascript:void(0)" @click=""><img src="../assets/svg/xmark.svg"></a>
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
    flex-flow: row nowrap;
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

    & a {
        position: absolute;
        top: -0.5rem;
        right: -0.5rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--color-background);
        height: 2.2rem;
        width: 2.2rem;
        border-radius: 1.1rem;
        border: 1px solid var(--color-primary-1);

        & img {
            height: 1.5rem;
            width: 1.5rem;
        }
    }
}
</style>