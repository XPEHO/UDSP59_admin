<script setup lang="ts">
import { ModulePartElement } from '@/models/ModulePartElement';
import { useRoute } from 'vue-router';

// Get the route
const route = useRoute();

// Properties of the component
defineProps({
    id: {
        type: String,
        required: true,
    },
    modulePartElt: {
        type: ModulePartElement,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
});

</script>

<template>
    <div class="module-part-elt-card">
        <div>
            <a href="javascript:void(0)" @click=""><img src="../assets/svg/chevron-up.svg"></a>
            <a href="javascript:void(0)" @click=""><img src="../assets/svg/chevron-down.svg"></a>
        </div>
        <p>{{ modulePartElt.text }}</p>
        <a href="javascript:void(0)" @click=""><img src="../assets/svg/delete.svg"></a>
        <RouterLink :to="'/module/' + id + '/' + route.params.part + '/' + index"><img
                src="../assets/svg/chevron-right.svg">
        </RouterLink>
    </div>
</template>

<style>
.module-part-elt-card {
    background-color: var(--color-primary-3);
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