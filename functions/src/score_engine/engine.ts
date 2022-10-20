import { getCurrentTimestamp } from "../data-service";
import { ContestantAnswers, TastingResults, ResultSummary} from "./model";

class ScoreEngine {
  correctBeers: string[];

  constructor(correctBeers: string[]) {
    this.correctBeers = correctBeers;
  }

  createResults(answers: ContestantAnswers[]): TastingResults {
    const roundResults: ResultSummary[] = answers.map((a) => a);
    // const roundResults = createContestantRoundResults(correctBeers!, answers);
    // sortByRankedPointScores(roundResults);
    // const beerScoreResults = createBeerScoreResults(correctBeers!, answers);
    // sortByRankedBeerTasteScores(beerScoreResults);
    return {
      roundResults,
      beerScoreResults,
      lastUpdated: getCurrentTimestamp(),
    } as TastingResults;
  }
}