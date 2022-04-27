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
          <a href="#" id="panel-fenetre-bouton-fermeture" @click="closeModal()"> X </a>
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
      return this.gameStore.victory ? 'Félications' : 'Dommage !';
    },
    modalToggle() {
      return this.gameStore.modalToggle;
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

<style></style>
