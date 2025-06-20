import { Answer } from "./Answer";
import { Category } from "./Category";

export interface Question {
    id: Number,
    question: String,
    type: String,
    level: String,
    category: Category,
    answers: Answer[]
}