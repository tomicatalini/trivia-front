import { Question } from "./Question";

export interface GameQuestion {
    gameId: Number,
    question: Question,
    start: Date,
    finish: Date,
    valid: Boolean
}