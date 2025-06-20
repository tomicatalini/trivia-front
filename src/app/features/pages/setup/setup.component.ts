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
import { finalize, map, tap } from 'rxjs';
import { Auth } from '../../../model/Auth';

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
  accordion = viewChild.required(MatAccordion);

  quizList = signal<Quiz[]>([]);
  selectedQuiz = signal<Quiz | null>(null);

  categoryList = signal<Category[]>([]);
  selectedCategory = signal<Category | null>(null);

  gameMode = signal<GameMode | null>(null);
  questionCount = signal<Number | null>(15);
 
  readonly isQuizAvailable = computed(() => this.selectedQuiz() != null);
  readonly isSingleQuiz = computed(() => this.quizList().length === 1);
  readonly isMultipleQuiz = computed(() => this.quizList().length > 1);

  readonly isCategoryAvailable = computed(() => this.selectedCategory() != null);
  readonly hasCategories = computed(() => this.categoryList().length > 0);

  readonly isGameModeAvailable = computed(() => this.gameMode() != null);
  readonly isQuestionCount = computed(() => this.questionCount() != null);

  modos: GameMode[] = [
    { name: 'EASY', field: 'Fácil', description: 'Preguntas fáciles para comenzar.' },
    { name: 'MEDIUM', field: 'Medio', description: 'Un desafío equilibrado.' },
    { name: 'HARD', field: 'Difícil', description: 'Solo para expertos.' },
    { name: 'RANDOM', field: 'Aleatorio', description: 'Dificultad aleatoria.' },
    { name: 'EASY_TO_HARD', field: 'Fácil a Difícil', description: 'Simula "¿Quién quiere ser millonario?" con 15 preguntas.' }
  ];

  constructor(
    private triviaService: TriviaService,
    private gameService: GameService,
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
          // Mostrar mensaje: No hay fuentes disponibles
          this.selectedQuiz.set(null);
        } else if (quizzes.length === 1) {
          this.selectedQuiz.set(quizzes[0]);
          // Mostrar mensaje: Solo hay una fuente, seleccionada automáticamente
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

    console.log(auth);

    this.triviaService
      .startGame(quiz.id, auth.userId, category.id, mode.name, count)
      .subscribe(console.log);
  }

  handleCategorySelection(category: Category): void {
    this.selectedCategory.set(category);
  }

  handleGameModeSelection(gameMode: GameMode): void {
    this.gameMode.set(gameMode);
  }

}
