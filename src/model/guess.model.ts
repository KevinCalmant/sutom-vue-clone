export default class Guess {
  constructor(
    public letter = "",
    public isCorrect = false,
    public isRightPosition = false,
    public isOldGuess = false
  ) {}
}
