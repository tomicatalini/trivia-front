import { Component, Signal } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { GameService } from '../../../core/services/game.service';
import { Game } from '../../../model/Game';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TriviaService } from '../../../core/services/trivia.service';
import { AuthService } from '../../../auth/auth.service';

interface GameMode {
  mode: String,
  name: String,
  description: String,
  color: String,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [ HeaderComponent, FooterComponent, RouterOutlet, RouterModule, CommonModule, ReactiveFormsModule]
})
export class HomeComponent {

  game: Signal<Game | null>;
  
  showRouterOutlet: boolean = false;

  gameModeExpanded: String = '';
  modeSelected: String = '';

  gameModeData: GameMode[] = [
    { mode: 'Fácil', name: 'easy', color: 'text-indigo-500', description: 'Perfecto para principiantes o para aquellos que solo quieren relajarse y disfrutar. En este modo, las preguntas son sencillas y directas, dándote la oportunidad de familiarizarte con el juego y ganar confianza. ¡Ideal para un calentamiento cerebral!'},
    { mode: 'Medio', name: 'medium', color: 'text-green-500', description: '¿Crees que sabes un poco más? El modo Medio sube la apuesta con preguntas que requieren un conocimiento general más amplio. Aquí empezarás a pensar un poco más, pero sin la presión de los desafíos más duros. ¡Pon a prueba tu memoria!'},
    { mode: 'Difícil', name: 'hard', color: 'text-red-500', description: 'Solo para los verdaderos maestros del saber. Prepárate para preguntas que desafiarán incluso a los más expertos. Este modo está diseñado para poner a prueba tus límites y descubrir qué tan profundo es tu conocimiento en diversas áreas. ¡Solo para valientes!'},
    { mode: 'Aleatorio', name: 'random', color: 'text-yellow-500', description: '¿Te gusta la aventura y las sorpresas? En el modo Aleatorio, nunca sabrás qué tipo de pregunta te espera. Puedes pasar de una pregunta fácil a una extremadamente difícil en un instante, lo que lo convierte en un desafío impredecible y emocionante. ¡Cada partida es una nueva experiencia!'},
    { mode: 'Fácil a Difícil', name: 'easy_to_hard', color: 'text-purple-500', description: 'Comienza tu viaje en la comodidad de las preguntas fáciles y, a medida que avanzas, la dificultad irá aumentando progresivamente. Este modo te permite construir tu confianza antes de enfrentarte a los verdaderos retos. ¡Demuestra tu habilidad y ve hasta dónde puedes llegar!'},
  ]

  questionCount: FormControl = new FormControl('');

  constructor(
    private gameService: GameService,
    private triviaService: TriviaService,
    private authService: AuthService,
  ){
    this.game = this.gameService.game;
  }

  toggleMode(mode: String): void {
    this.modeSelected = mode;
    this.gameModeExpanded = mode != this.gameModeExpanded ? mode : '';
  }

  prueba(): void {
    this.triviaService.startGame(
      this.game()?.quiz?.id!,
      this.authService.getUserData()?.userId!,
      this.game()?.category?.id!,
      this.modeSelected.toUpperCase(),
      Number.parseInt(this.questionCount.value)
    ).subscribe(console.log);

  }
}
