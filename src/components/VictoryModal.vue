<template>
  <div
    id="panel-area"
    class="fin-de-partie-panel"
    :style="{ display: modalToggle ? 'block' : 'none' }"
  >
    <div id="panel-fenetre">
      <div id="panel-fenetre-header">
        <h2 id="panel-fenetre-title">{{ title }}</h2>
        <div>
          <a href="#" id="panel-fenetre-bouton-fermeture" @click="closeModal()">
            X
          </a>
        </div>
      </div>
      <div class="panel-fenetre-contenu">
        <p class="fin-de-partie-panel-phrase">{{ text }}</p>
        <div id="fin-de-partie-panel-resume">
          <div class="fin-de-partie-panel-resume-ligne" v-for="guesses in allGuesses">
            <Fragment v-for="guess in guesses">
              <span v-if="guess.isRightPosition" class="emoji-carre-rouge">🟥</span>
              <span v-else-if="guess.isCorrect" class="emoji-cercle-jaune">🟡</span>
              <span v-else class="emoji-carre-bleu">🟦</span>
            </Fragment>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useGameStore } from "../store/game.state";

export default {
  setup() {
    const gameStore = useGameStore();

    return {
      gameStore,
    };
  },
  computed: {
    title() {
      return this.gameStore.victory ? "Félications" : "Dommage";
    },
    text() {
      return this.gameStore.victory
        ? "Bravo, tu as gagné. Reviens demain pour une nouvelle grille."
        : "Bien essayé, Reviens demain pour une nouvelle grille.";
    },
    modalToggle() {
      return this.gameStore.modalToggle;
    },
    allGuesses() {
      return this.gameStore.guesses;
    },
  },
  methods: {
    closeModal() {
      this.gameStore.$patch((state) => {
        state.modalToggle = false;
      });
    },
  },
};
</script>

<style>
#fin-de-partie-panel-resume {
  display: flex;
  flex-direction: column;
  margin-left: 40%;
}

.fin-de-partie-panel-resume-ligne {
  display: flex;
  flex-direction: row;
  gap: 0.2em;
}
</style>
