import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../../model/ApiResponse';
import { GameQuestion } from '../../model/GameQuestion';

const USER_ENDPOINT = 'user';
const QUIZ_ENDPOINT = 'quiz';
const CATEGORY_ENDPOINT = 'category';
const GAME_ENDPOINT = 'game';

@Injectable({
  providedIn: 'root'
})
export class TriviaService {
  private http = inject(HttpClient);

  private baseURL: string = 'http://localhost:8080';

  constructor() {}

  getAllQuizzies(): Observable<ApiResponse> {
    const endpoint = `${this.baseURL}/${QUIZ_ENDPOINT}`;

    return this.http.get(endpoint, { responseType: 'json' }) as Observable<ApiResponse>;
  }

  getAllCategories(quizId: Number): Observable<ApiResponse> {
    const endpoint = `${this.baseURL}/${CATEGORY_ENDPOINT}`;
    const params = new HttpParams().set('quizId', quizId.toString());

    return this.http.get(endpoint, {
      params,
      responseType: 'json' 
    }) as Observable<ApiResponse>;
  }

  startGame(quizId: Number, playerId: Number, categoryId: Number, level: String, numberOfQuestions: Number): Observable<ApiResponse> {
    const endpoint = `${this.baseURL}/${GAME_ENDPOINT}/start`;
    
    const body = {
      quizId,
      playerId,
      categoryId,
      level,
      numberOfQuestions
    }

    return this.http.post(endpoint, body, { responseType: 'json' }) as Observable<ApiResponse>;
  }

  endGame(quizId: Number, userId: Number, gameId: Number, score: Number, startDate: Date, endDate: Date, gameQuestions: GameQuestion[]): Observable<ApiResponse> {
    const endpoint = `${this.baseURL}/${GAME_ENDPOINT}/end`;

    const payload = {
      quizId,
      userId,
      gameId,
      score,
      startDate,
      endDate,
      gameQuestions
    }

    return this.http.post(endpoint, payload, { responseType: 'json' }) as Observable<ApiResponse>;
  }

  ranking(): Observable<ApiResponse> {
    const endpoint = `${this.baseURL}/${GAME_ENDPOINT}/ranking`;

    return this.http.get(endpoint, { responseType: 'json' }) as Observable<ApiResponse>;
  }
}
