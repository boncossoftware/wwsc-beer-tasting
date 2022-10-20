import { ContestantAnswers, ResultSummary } from "../model";
import { getAnswerFromInput, getResultsSummaryFromInput, Rule } from "./rule";

class CorrectBeerRule implements Rule {
    
    apply(answersOrResults: ContestantAnswers | [ContestantAnswers, ResultSummary]): [ContestantAnswers, ResultSummary] {
        const answers = getAnswerFromInput(answersOrResults);
        const results = getResultsSummaryFromInput(answersOrResults);

        return [answers, results];
    }

}