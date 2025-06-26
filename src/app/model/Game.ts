import { Category } from "./Category";
import { GameQuestion } from "./GameQuestion";
import { Quiz } from "./Quiz";

export interface Game {
    gameId: Number,
    score: Number,
    startDate: Date,
    endDate: Date,
    userId: Number,
    quizId: Number,
    category: Category,
    gameQuestions: GameQuestion[]
}