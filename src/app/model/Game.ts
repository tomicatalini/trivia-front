import { Category } from "./Category";
import { GameQuestion } from "./GameQuestion";
import { Quiz } from "./Quiz";

export interface Game {
    id?: Number,
    score?: Number,
    startDate?: Date,
    endDate?: Date,
    userId?: Number,
    quiz?: Quiz,
    category?: Category,
    gameQuestions?: GameQuestion[]
}