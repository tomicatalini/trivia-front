import { Component, computed, inject, signal } from '@angular/core';
import { GameService } from '../../../core/services/game.service';
import { Game } from '../../../model/Game';
import { Answer } from '../../../model/Answer';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TriviaService } from '../../../core/services/trivia.service';
import { map } from 'rxjs';
import { TimeBarComponent } from '../../../shared/components/time-bar/time-bar.component';

@Component({
  selector: 'app-play',
  imports: [CommonModule, TimeBarComponent],
  templateUrl: './play.component.html',
  standalone: true
})
export class PlayComponent {
  private gameService = inject(GameService);
  private router = inject(Router);
  private triviaService = inject(TriviaService);
  
  game = signal<Game | null>(this.gameService.game());
  questionsList = computed(() => this.game()?.gameQuestions || []);
  
  currentIndex = signal(0);
  selectedAnswer = signal<Answer | null>(null);

  currentGameQuestion = computed(() =>
    this.game()?.gameQuestions![this.currentIndex()]
  );

  currentQuestion = computed(() =>
    this.currentGameQuestion()?.question
  );

  isLastQuestion = computed(() =>
    this.currentIndex() >= (this.game()?.gameQuestions!.length ?? 0) - 1
  );

  numberCorrectAnswers = signal(0);

  currentTime = signal(0);
  timerInterval: any;

  constructor(){}

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    const currentGQ = this.currentGameQuestion();
    if (currentGQ) {
      currentGQ.start = new Date();
      this.currentTime.set(0);

      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        this.currentTime.update(t => t + 1);
      }, 1000);
    }
  }

  selectAnswer(answer: Answer) {
    if (this.selectedAnswer()) return;

    this.stopTimer();
    this.selectedAnswer.set(answer);

    const currentGQ = this.currentGameQuestion();
    if (!currentGQ) return;

    currentGQ.finish = new Date();
    currentGQ.valid = answer.valid;

    if(answer.valid){
      this.numberCorrectAnswers.update( n => n + 1);
    }
  }

  next() {
    if (this.isLastQuestion()) {
      this.endGame();
      return;
    }

    this.currentIndex.update(i => i + 1);
    this.selectedAnswer.set(null);
    this.startTimer();
  }

  endGame() {
    const game = this.game();
    if (game) {
      game.endDate = new Date();
      this.triviaService.endGame(game.quizId, game.userId, game.gameId, game.score, game.startDate, game.endDate, game.gameQuestions)
      .pipe(
        map(response => response.result)
      )
      .subscribe(score => {
        game.score = score;
        this.gameService.setGame(game);
        this.router.navigate(['/home/resume']);
      });
    }
  }

  getAnswerClass(ans: Answer) {
    const selected = this.selectedAnswer();
    if (!selected) return 'hover:bg-blue-50';

    if (ans === selected && ans.valid) return 'bg-green-100 border-green-500';
    if (ans === selected && !ans.valid) return 'bg-red-100 border-red-500';
    if (ans.valid) return 'bg-green-50 border-green-400';
    return 'opacity-50';
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }
}
