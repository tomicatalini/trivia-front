import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { Quiz } from '../../../model/Quiz';
import { TriviaService } from '../../../core/services/trivia.service';
import { GameService } from '../../../core/services/game.service';
import { Category } from '../../../model/Category';
import { map } from 'rxjs';
import { Auth } from '../../../model/Auth';
import { Router } from '@angular/router';

interface GameMode {
  name: String,
  field: String,
  description: String
}

@Component({
  selector: 'app-setup',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './setup.component.html',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupComponent {
  modos: GameMode[] = [
      { name: 'EASY', field: 'Fácil', description: 'Preguntas fáciles para comenzar.' },
      { name: 'MEDIUM', field: 'Medio', description: 'Un desafío equilibrado.' },
      { name: 'HARD', field: 'Difícil', description: 'Solo para expertos.' },
      { name: 'RANDOM', field: 'Aleatorio', description: 'Dificultad aleatoria.' },
      { name: 'EASY_TO_HARD', field: 'Fácil a Difícil', description: 'Simula "¿Quién quiere ser millonario?" con 15 preguntas.' }
  ];

  cantidades: Number[] = [5, 10, 15, 20, 25];

  accordion = viewChild.required(MatAccordion);

  quizList = signal<Quiz[]>([]);
  selectedQuiz = signal<Quiz | null>(null);

  categoryList = signal<Category[]>([]);
  selectedCategory = signal<Category | null>(null);

  gameMode = signal<GameMode | null>(this.modos[0]);
  questionCount = signal<Number | null>(this.cantidades[0]);
 
  readonly isQuizAvailable = computed(() => this.selectedQuiz() != null);
  readonly isSingleQuiz = computed(() => this.quizList().length === 1);
  readonly isMultipleQuiz = computed(() => this.quizList().length > 1);

  readonly isCategoryAvailable = computed(() => this.selectedCategory() != null);
  readonly hasCategories = computed(() => this.categoryList().length > 0);

  readonly isGameModeAvailable = computed(() => this.gameMode() != null);
  readonly isQuestionCount = computed(() => this.questionCount() != null);

  constructor(
    private triviaService: TriviaService,
    private gameService: GameService,
    private router: Router,
  ) {
    this.loadQuizzes();

    // Reactivamente, cuando cambia el quiz seleccionado, cargar categorías
    effect(() => {
      const quiz = this.selectedQuiz();
      if (quiz) {
        this.loadCategories(quiz.id);
      } else {
        this.categoryList.set([]);
      }
    });
  }


  loadQuizzes() {
    this.triviaService.getAllQuizzies()
      .pipe(
        map(response => !!response.result ? response.result as Quiz[] : [])
      )
      .subscribe(quizzes => {
        this.quizList.set(quizzes);

        if (quizzes.length === 0) {
          this.selectedQuiz.set(null);
        } else if (quizzes.length === 1) {
          this.selectedQuiz.set(quizzes[0]);
        }
      });
  }

  loadCategories(quizId: Number) {
    this.triviaService.getAllCategories(quizId)
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

        this.categoryList.set(categories);
      });
  }

  startGame() {
    const quiz = this.selectedQuiz();
    const category = this.selectedCategory();
    const mode = this.gameMode();
    const count = this.questionCount();

    if (!quiz || !category || !mode || !count) return;

    const auth = JSON.parse(localStorage.getItem('auth_user')!) as Auth;
    
    this.triviaService
      .startGame(quiz.id, auth.userId, category.id, mode.name, count)
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

  handleCategorySelection(category: Category): void {
    this.selectedCategory.set(category);
  }

  handleGameModeSelection(gameMode: GameMode): void {
    this.gameMode.set(gameMode);
  }

  handleNumberQuestionSelection(number: Number): void {
    this.questionCount.set(number);
  }

}
