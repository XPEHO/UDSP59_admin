<script setup lang="ts">

import { useUserStore } from '../stores/user'

// Get the user store
const userStore = useUserStore();

// Reset the store by default
userStore.reset();

</script>

<template>
  <main class="login-view">
    <section>
      <img src="../assets/logo.png" alt="Logo">
    </section>
    <section>
      <h1 class="title-style">UDSP59 FORMATION</h1>
      <h2 class="subtitle-style">Espace Administrateur</h2>
      <button class="google-button" @click="userStore.loginWithGoogle()">
        <img src="../assets/google-logo.png" alt="Google logo">
        <span>Se connecter avec Google</span>
      </button>
      <footer>
        <p class="link-text">Produit par <a class="link-text-clickable" href="https://xpeho.com/"
            target="_blank">XPEHO</a></p>
        <a class="link-text-clickable" href="" target="_blank">Politiques de confidentialité</a>
      </footer>
    </section>
  </main>
</template>

<style>
main.login-view {
  display: flex;
  flex-direction: row;
  height: 100svh;

  & section:first-child {
    background-image: url('../assets/background.png'), linear-gradient(to bottom, rgba(208, 129, 60, 0.9), rgba(186, 22, 38, 0.9));
    background-position: center;
    background-size: cover;
    text-align: center;
    flex: 1.5;
    display: flex;
    justify-content: center;
    align-items: center;

    & img {
      height: 50%;
    }
  }

  & section:last-child {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;

    & .title-style {
      text-align: center;
    }

    & .subtitle-style {
      text-align: center;
      margin-bottom: 4rem;
    }

    & .google-button {
      margin-bottom: 2rem;
      font-size: 15pt;
      font-weight: 500;
      padding: 0.5rem 2rem;
      color: dimgray;
      background: var(--color-background);
      border: 1px solid #c3c3c3;
      border-radius: 0.5rem;
      cursor: pointer;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      box-shadow: 3px 3px 10px 1px rgba(0, 0, 0, 0.2);
      transition: box-shadow 0.1s ease-in-out;

      & img {
        width: 2.2rem;
        margin-right: 1rem;
      }

      &:active {
        box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.2);
      }
    }

    & footer {
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;
      column-gap: 2rem;

      & .link-text {
        font-size: 12pt;
        font-weight: 400;
        line-height: 1.5;
        color: #251438;
        text-align: center;
      }

      & .link-text-clickable {
        font-size: 12pt;
        font-weight: 400;
        line-height: 1.5;
        color: #251438;
        text-align: center;
        text-decoration: underline;
      }
    }
  }
}

@media screen and (max-width: 860px) {
  main#login-view section:first-child {
    display: none;
  }
}
</style>