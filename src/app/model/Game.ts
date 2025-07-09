import { Category } from "./Category";
import { GameQuestion } from "./GameQuestion";
import { Quiz } from "./Quiz";

export interface Game {
    gameId: Number,
    startDate: Date,
    endDate: Date,
    mode: String,
    numberOfQuestions: Number,
    time: Number,
    score: Number,
    userId: Number,
    quizId: Number,
    category: Category,
    gameQuestions: GameQuestion[],
}