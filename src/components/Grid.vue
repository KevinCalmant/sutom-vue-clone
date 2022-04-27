<template>
  <div class="grille" id="grille">
    <table>
      <tr v-for="n in 6" :key="'try' + n">
        <td
          v-for="(guess, index) in guesses[n - 1]"
          :key="n + guess.letter + index"
          :class="{
            resultat: guess.isOldGuess,
            'bien-place': guess.isRightPosition,
            'mal-place': guess.isCorrect && !guess.isRightPosition,
          }"
        >
          {{ guess.letter.toUpperCase() }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import Guess from "../model/guess.model";
import { useGameStore } from "../store/game.state";

export default {
  props: {
    word: {
      type: String,
      required: true,
    },
  },
  setup() {
    const currentTry = ref(0);
    const letterMissing = ref();
    const gameStore = useGameStore();
    return {
      currentTry,
      letterMissing,
      gameStore,
    };
  },
  beforeCreate() {
    this.letterMissing = this.word;
    window.addEventListener("keydown", ($event) => this.handleKeyboard($event));
  },
  computed: {
    guesses() {
      return this.gameStore.guesses;
    },
    currentGuesses() {
      return this.gameStore.guesses[this.currentTry];
    },
    oldGuesses(): Guess[] {
      if (this.currentTry !== 0) {
        return this.gameStore.guesses[this.currentTry - 1];
      }
      return [];
    },
  },
  methods: {
    handleKeyboard(keyboardEvent: KeyboardEvent): void {
      switch (keyboardEvent.key) {
        case "Backspace":
          const firstIndexOfPoint = this.currentGuesses
            .map((guess) => guess.letter)
            .indexOf(".");
          if (firstIndexOfPoint === -1) {
            this.currentGuesses[this.currentGuesses.length - 1].letter = ".";
          } else if (
            firstIndexOfPoint - 1 != 0 &&
            !this.currentGuesses[firstIndexOfPoint - 1].isRightPosition
          ) {
            this.currentGuesses[firstIndexOfPoint - 1].letter = ".";
          }
          break;
        case "Enter":
          this.checkGuess();
          break;
        default:
          this.addToGuess(keyboardEvent.key);
          break;
      }
    },
    /**
     * This method add or remove the key from the current guess.
     */
    addToGuess(key: string): void {
      if (key.length === 1) {
        if (
          this.currentGuesses.filter((guess) => guess.letter === ".").length ===
            this.currentGuesses.length - 1 &&
          this.currentGuesses[0].letter === key
        ) {
          return;
        }
        const lastPointIndex = this.currentGuesses
          .map((guess) => guess.letter)
          .indexOf(".");
        this.currentGuesses[lastPointIndex].letter = key;
      }
    },
    /**
     * This method check if the user has found the right word.
     *
     */
    checkGuess() {
      let index = 0;
      // We still have points in the current guess then the check algorithm should not continue.
      if (this.currentGuesses.map((guess) => guess.letter).includes(".")) {
        return;
      }

      if (this.oldGuesses.length != 0) {
        // We must checked last guess because this will delay the motus animation if we start at index 0.
        index = this.oldGuesses.filter((guess) => guess.isRightPosition).length;
      }
      // Every half second we check if the letter is correct and at the right position.
      const intervalId = setInterval(() => {
        const checkGuess = this.currentGuesses[index];

        // If the letter is in the right position we must remove it from the string to compute isCorrect and preventing
        // duplication.
        if (this.word[index] === checkGuess.letter) {
          this.letterMissing = this.letterMissing.replace(this.word[index], "");
        }

        // The current guess is updated with right flages This will naturally create the motus animation.
        this.currentGuesses[index].letter = checkGuess.letter;
        this.currentGuesses[index].isCorrect =
          this.letterMissing.indexOf(checkGuess.letter) !== -1;
        this.currentGuesses[index].isRightPosition =
          this.word[index] == checkGuess.letter;
        this.currentGuesses[index].isOldGuess = true;

        index++;

        // At the end of the word we need to clean the interval and check if the player won the game.
        if (this.currentTry === 5) {
          clearInterval(intervalId);
          this.gameStore.$patch((state) => {
            state.modalToggle = true;
            state.victory = false;
          });
          return;
        } else if (index >= this.word.length) {
          clearInterval(intervalId);
          // The player haven't found the word and he still have tries so we create a new guesses array.
          if (this.letterMissing.length > 0 && this.currentTry != 6) {
            this.guesses[this.currentTry + 1].forEach((guess, index) => {
              if (!this.currentGuesses[index].isRightPosition) {
                guess.letter = ".";
              } else {
                guess.isOldGuess = true;
                guess.isOldGuess = true;
                guess.isRightPosition = true;
                guess.letter = this.currentGuesses[index].letter;
              }
            });
            this.currentTry++;
          } else {
            this.gameStore.$patch((state) => {
              state.modalToggle = true;
              state.victory = true;
            });
          }
        }
      }, 300);
    },
  },
};
</script>
