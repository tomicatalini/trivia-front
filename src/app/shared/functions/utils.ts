export function gameModeString(mode: String): string {
    const modeaux = mode as string;

    return {
      EASY: 'Fácil',
      MEDIUM: 'Medio',
      HARD: 'Difícil',
      RANDOM: 'Aleatorio',
      EASY_TO_HARD: 'De fácil a difícil',
    }[modeaux] || modeaux;
}

export function gameModes(): string[] {
    return ['EASY', 'MEDIUM', 'HARD', 'RANDOM', 'EASY_TO_HARD'];
}

export function questionQuantity(): number[] {
    return [10, 15, 20, 25, 30];
}
