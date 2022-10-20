import { ContestantAnswers, ResultSummary } from "../model";

export interface Rule {
  apply(
    answersOrResults: ContestantAnswers | [ContestantAnswers, ResultSummary]
  ): [ContestantAnswers, ResultSummary];
}

export const getAnswerFromInput = function (
  answersOrResults: ContestantAnswers | [ContestantAnswers, ResultSummary]
) {
  return (
    answersOrResults instanceof Array ? answersOrResults[0] : answersOrResults
  ) as ContestantAnswers;
};

export const getResultsSummaryFromInput = function (
  answersOrResults: ContestantAnswers | [ContestantAnswers, ResultSummary]
) {
  const answers = getAnswerFromInput(answersOrResults);
  return (
    answersOrResults instanceof Array
      ? answersOrResults[1]
      : {
          totalPoints: 0,
          totalTaste: 0,
          totalAsterisks: 0,
          totalAsterisksSecondHalf: 0,
          totalChanges: 0,
          roundResults: [],
          userEmail: answers.id,
          beerScores: {},
        }
  ) as ResultSummary;
};
