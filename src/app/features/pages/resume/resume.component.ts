import { Component, inject, signal } from '@angular/core';
import { GameService } from '../../../core/services/game.service';
import { Router } from '@angular/router';

import confetti from 'canvas-confetti';

@Component({
  selector: 'app-resume',
  imports: [],
  templateUrl: './resume.component.html',
  standalone: true
})
export class ResumeComponent {
  private gameService = inject(GameService);
  private router = inject(Router);

  game = this.gameService.game();

  ngOnInit(): void {

    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
      });
    }, 200);
  }

  get totalQuestions(): Number {
    return this.game?.gameQuestions.length ?? 0;
  }

  get correctAnswers(): Number {
    return this.game?.gameQuestions.filter(gq => gq.valid).length ?? 0;
  }

  get totalTime(): Number {
    return this.game?.time ?? 0;
  }

  get score(): Number {
    return this.game?.score ?? 0;
  }

  volverAJugar() {
    this.router.navigate(['/home/setup']);
  }

  verRanking() {
    this.router.navigate(['/home/top']);
  }
}
