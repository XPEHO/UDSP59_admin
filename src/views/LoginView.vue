<script setup lang="ts">

</script>

<template>
  <main>
    <section>
      <img src="../assets/logo.png" alt="Logo">
    </section>
    <section>
      <h1 class="title-text">UDSP59 FORMATION</h1>
      <h2 class="subtitle-text">Espace Administrateur</h2>
      <form>
        <input class="input-text" type="email" id="email" size="25" placeholder="Email" />
        <input class="input-text" type="password" id="password" size="25" placeholder="Mot de passe" />
        <button class="button-text" type="submit">Se connecter</button>
      </form>
      <footer>
        <p class="link-text">Produit par <a class="link-text-clickable" href="https://xpeho.com/"
            target="_blank">XPEHO</a></p>
        <a class="link-text-clickable" href="" target="_blank">Politiques de confidentialité</a>
      </footer>
    </section>
  </main>
</template>

<style>
main {
  display: flex;
  flex-direction: row;
  height: 100svh;
}

section:first-child {
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

@media screen and (max-width: 860px) {
  section:first-child {
    display: none;
  }
}

section:last-child {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  & .title-text {
    text-align: center;
  }

  & .subtitle-text {
    text-align: center;
    margin-bottom: 4rem;
  }

  & form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;

    & .input-text {
      margin-bottom: 1rem;

      &:nth-child(2) {
        margin-bottom: 3rem;
      }
    }
  }

  & footer {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    column-gap: 2rem;
  }
}
</style>