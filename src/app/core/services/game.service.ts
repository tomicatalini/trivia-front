import { Injectable, signal } from '@angular/core';
import { Game } from '../../model/Game';
import { Category } from '../../model/Category';
import { Quiz } from '../../model/Quiz';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private _game = signal<Game | null>(null);
  readonly game = this._game.asReadonly();

  constructor() { }

  setGame(game: Game): void {
    this._game.set(game);
  }

  clearGame(): void {
    this._game.set(null);
  }

  setGameCategory(category: Category): void {
    const newGame: Game = {...this.game()!};
    newGame.category = category;

    this._game.set(newGame);
  }

  setGameQuiz(quiz: Quiz): void {
    const newGame: Game = {...this.game()!};
    newGame.quizId = quiz.id;

    this._game.set(newGame);
  }
}
