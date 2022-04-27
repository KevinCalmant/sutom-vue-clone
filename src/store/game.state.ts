import { defineStore } from "pinia";
import Guess from "../model/guess.model";

export const useGameStore = defineStore("game", {
  state: (): { victory: boolean; modalToggle: boolean; guesses: Guess[][] } => {
    return {
      victory: false,
      modalToggle: false,
      guesses: [],
    };
  },
});
