import { Component, inject, signal } from '@angular/core';
import { TriviaService } from '../../../core/services/trivia.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

interface User {
  id: number,
  name: string,
  email: string,
  password: string,
  rol: string
}

interface Ranking {
  user: User,
  date: Date,
  score: number,
  time: number,
}

@Component({
  selector: 'app-ranking',
  imports: [CommonModule, MatTableModule, MatIconModule],
  templateUrl: './ranking.component.html',
  standalone: true,
})
export class RankingComponent {
  private triviaService = inject(TriviaService);

  displayedColumns = ['position', 'username', 'date', 'time', 'score'];
  dataSource: Ranking[] = [];

  constructor(){
    this.triviaService.ranking()
      .pipe(
        map(response => (response.result || []) as Ranking[])
      )
    .subscribe(ranks => this.dataSource = ranks);
  }

  getDateString(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  getMedal(index: number): string | null {
  return index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;
}
}
