import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { gameModes, gameModeString, questionQuantity } from '../../../shared/functions/utils';
import { TriviaService } from '../../../core/services/trivia.service';
import { Quiz } from '../../../model/Quiz';
import { map } from 'rxjs';
import { Category } from '../../../model/Category';
import { GameService } from '../../../core/services/game.service';
import { Auth } from '../../../model/Auth';

@Component({
  standalone: true,
  selector: 'app-setup',
  imports: [CommonModule, FormsModule],
  templateUrl: './setup.component.html',
})
export class SetupComponent {
  private router = inject(Router);
  private triviaService = inject(TriviaService);
  private gameService = inject(GameService);

  sources = signal<Quiz[]>([]);
  categories = signal<Category[]>([]);
  
  selectedSource = signal<Quiz | null>(null);
  selectedCategory = signal<Category | null>(null);
  selectedMode = signal<string>('RANDOM');
  selectedAmount = signal<number>(10);

  modes: string[] = gameModes();
  quantities: number[] = questionQuantity();

  constructor() {
    this.loadSources();

    // Actualizar categorías cuando cambia la fuente
    effect(() => {
      const source = this.selectedSource();
      if (source) this.loadCategories(source.id);
    });
  }

  loadSources() {
    this.triviaService.getAllQuizzies()
      .pipe(
        map(response => !!response.result ? response.result as Quiz[] : [])
      )
      .subscribe(sources => {
        this.sources.set(sources);

        if (sources.length === 1) {
          this.selectedSource.set(sources[0]);
        }
      });
  }

  loadCategories(sourceId: number | Number) {
    this.triviaService.getAllCategories(sourceId)
      .pipe(
        map(response => !!response.result ? response.result as Category[] : [])
      )
      .subscribe(categories => {

        if (categories.length === 0) {
          this.selectedCategory.set(null);
        } else {
          categories.unshift({ id: 0, category: 'All', description: 'All categories', enable: true});
          this.selectedCategory.set(categories[0]);
        }

        this.categories.set(categories);
      });
  }

  formatMode(mode: string): string {
    return gameModeString(mode);
  }

  canStart = computed(() =>
    !!this.selectedSource() &&
    !!this.selectedCategory() &&
    !!this.selectedMode() &&
    !!this.selectedAmount()
  );

  startGame() {
    const src = this.selectedSource();
    const category = this.selectedCategory();
    const mode = this.selectedMode();
    const count = this.selectedAmount();

    if (!src || !category || !mode || !count) return;

    const auth = JSON.parse(localStorage.getItem('auth_user')!) as Auth;
    
    this.triviaService
      .startGame(src.id, auth.userId, category.id, mode, count)
      .pipe(
        map(response => response.result)
      )
      .subscribe(game => {
          if(game != null){
            this.gameService.setGame(game);
            this.router.navigate(['/home/play']);
          } else {
            console.info('Ocurrio un error al obtener la partida');
          }
      });
  }
}
