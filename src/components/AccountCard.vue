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

// Function to focus the end of the input
function focusInput(event: MouseEvent) {
    // Get the textarea and focus it
    let input = (event.target as HTMLElement).closest('.account-card')?.querySelector('input') as HTMLInputElement;
    input.focus();
    // Focus the end of the text
    input.setSelectionRange(input.value.length, input.value.length);
}

// Template functions
function deleteAccount(id: string) {
    dataStore.deleteAccount(id);
}

function editAccount(id: string, attribute: string, value: any) {
    dataStore.editAccount(id, attribute, value);
}

</script>

<template>
    <div class="account-card">
        <a class="admin-switch" href="javascript:void(0)" @click="editAccount(id, 'admin', !account.admin)"
            title="Changer le rôle">
            <img v-if="account.admin" src="../assets/fireman-helmet.png">
            <img src="../assets/svg/user.svg">
        </a>
        <p>{{ account.admin ? 'Administrateur' : 'Éditeur' }}</p>
        <input class="input-style" type="email" name="mail"
            @input="editAccount(id, 'mail', ($event.target as HTMLInputElement).value)" :value="account.mail" />
        <div>
            <a href="javascript:void(0)" @click="focusInput"><img src="../assets/svg/edit.svg"></a>
            <a href="javascript:void(0)" @click="deleteAccount(id)"><img src="../assets/svg/delete.svg"></a>
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
    position: relative;

    & .admin-switch {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        margin-bottom: 0.5rem;

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

    & .input-style {
        text-align: center;
        border: none;
        margin: 1.5rem 0;
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