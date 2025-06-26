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

  animatedScore = signal(0);

  ngOnInit(): void {
    const finalScore: number = (this.game?.score ?? 0) as number;
    let current: number = 0;
    const interval = setInterval(() => {
      if (current >= finalScore) {
        clearInterval(interval);
        this.animatedScore.set(finalScore);
      } else {
        current += Math.ceil(finalScore / 30);
        this.animatedScore.set(Math.min(current, finalScore));
      }
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
      });
    }, 200);
  }

  get totalQuestions(): number {
    return this.game?.gameQuestions.length ?? 0;
  }

  get correctAnswers(): number {
    return this.game?.gameQuestions.filter(gq => gq.valid).length ?? 0;
  }

  get totalTime(): number {
    if (!this.game?.startDate || !this.game?.endDate) return 0;
    const diffMs = new Date(this.game.endDate).getTime() - new Date(this.game.startDate).getTime();
    return Math.floor(diffMs / 1000); // en segundos
  }

  volverAJugar() {
    this.router.navigate(['/home/setup']);
  }

  verRanking() {
    this.router.navigate(['/home/top']);
  }
}
