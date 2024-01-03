<script setup lang="ts">
import { Account } from '@/models/Account';
import { useDataStore } from '@/stores/data';

// Get the datas store
const dataStore = useDataStore();

// Properties of the component
defineProps({
    id: {
        type: String,
        required: true,
    },
    account: {
        type: Account,
        required: true,
    },
});

function focusInput(event: MouseEvent) {
    // Get the textarea and focus it
    let input = (event.target as HTMLElement).closest('.account-card')?.querySelector('input') as HTMLInputElement;
    input.focus();
    // Focus the end of the text
    input.setSelectionRange(input.value.length, input.value.length);
}

</script>

<template>
    <div class="account-card">
        <a class="admin-switch" href="javascript:void(0)" @click="account.admin = !account.admin" title="Changer le rôle">
            <img v-if="account.admin" src="../assets/fireman-helmet.png">
            <img src="../assets/svg/user.svg">
        </a>
        <input name="mail" @input="" :value="account.mail" />
        <div>
            <a href="javascript:void(0)" @click="focusInput"><img src="../assets/svg/edit.svg"></a>
            <a href="javascript:void(0)" @click=""><img src="../assets/svg/delete.svg"></a>
        </div>
    </div>
</template>

<style>
.account-card {
    background-color: var(--color-primary-1);
    color: var(--color-background);
    padding: 2.2rem 1.5rem 1.5rem 1.5rem;
    border-radius: 1rem;
    width: 20rem;
    box-shadow: 3px 3px 10px 1px rgb(0 0 0 / 40%);
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    position: relative;

    & .admin-switch {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;

        & img[src*="user"] {
            height: 4rem;
            width: 4rem;
        }

        & img[src*="fireman"] {
            height: 2.8rem;
            width: 3.3rem;
            position: absolute;
            top: -1.6rem;
        }
    }

    & input {
        font-size: 14pt;
        width: 100%;
        height: 100%;
        resize: none;
        border: none;
        background: none;
        color: var(--color-background);
        text-align: center;

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