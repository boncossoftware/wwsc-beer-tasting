import * as functions from "firebase-functions";
import {
  ContestantAnswers,
  RoundResult,
  ResultSummary,
  BeerRanking,
  TastingResults,
  ServerError,
} from "./model";
import {
  getCurrentTimestamp,
  getTastingEvent,
  getTastingEventAnswers,
  setResults,
} from "./data-service";

const onCall = functions.https.onCall;

export const TIE_BREAKER_REASON_LESS_ASTERISKS = "Less asterisks used overal";
export const TIE_BREAKER_REASON_MORE_CORRECT_SECOND_HALF =
  "More correct beers in second half";
export const DRINK_OFF = "DRINK OFF!";

/**
 * ResultsError for an error object
 * with a error code.
 */
export class ResultsError extends Error {
  code: number | undefined;

  /**
   * Constructs an error with the specified code.
   * @param {string} message The error message
   * @param {number} code The error code
   */
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

export const calculateResults = onCall(async (data, _) => {
  // Get all answers.
  const id = data;

  try {
    // Fetch event & answers
    functions.logger.debug(`fetching answers (${id})`);
    let [event, answers] = await Promise.all([
      getTastingEvent(id),
      getTastingEventAnswers(id),
    ]);
    functions.logger.debug(`answers fetched (${id})`);

    // Get the correct order of beers.
    const barTenderAnswers = answers.find((a) => a.id === event.bartender);
    validateBarTenderAnswers(barTenderAnswers);

    const correctBeers = barTenderAnswers?.beers;
    functions.logger.debug(`answers valid (${id})`);

    // clear out the bartender's answers and owner answers if needed.
    const exludeEmails = [
      event.bartender,
      event.ownerAddedAsTaster && event.owner,
    ];
    answers = answers.filter((a) => !exludeEmails.includes(a.id));

    // Create the tasting results
    const roundResults = createContestantRoundResults(correctBeers!, answers);
    sortByRankedPointScores(roundResults);
    const beerScoreResults = createBeerScoreResults(correctBeers!, answers);
    sortByRankedBeerTasteScores(beerScoreResults);
    const tastingResults = {
      roundResults,
      beerScoreResults,
      lastUpdated: getCurrentTimestamp(),
    } as TastingResults;
    functions.logger.debug(`results created (${id})`);

    // Save the results.
    setResults(id, tastingResults);
    functions.logger.debug(`results saved (${id})`);

    // Reply with the results.
    return tastingResults;
  } catch (error) {
    const message = (error as ResultsError).message;
    const code = (error as ResultsError).code;
    functions.logger.error(
      `Error: ${message} (${code})\n` + `${(error as any).stack}`
    );

    return {error: {message, code}} as ServerError;
  }
});

export const validateBarTenderAnswers = (
  anwsers: ContestantAnswers | undefined
) => {
  if (anwsers?.beers === undefined) {
    throw new ResultsError("No answers found for bartender.", 1500);
  }
  functions.logger.debug(`bartender has answers (${anwsers.id})`);

  // Make sure every beer is set.
  const allBeersSet = anwsers?.beers
    ?.map((b) => b?.length > 0)
    ?.every((set) => set);
  if (!allBeersSet) {
    throw new ResultsError("Bar tender has not set all beers yet.", 1500);
  }
  functions.logger.debug(`bartender has all beers set (${anwsers.id})`);
};

export const createContestantRoundResults = (
  correctBeers: string[],
  contestantAnswers: ContestantAnswers[]
): ResultSummary[] => {
  const rounds = correctBeers.length;
  return (contestantAnswers || []).map((contestantAnswers) => {
    const summary: ResultSummary = {
      totalPoints: 0,
      totalTaste: 0,
      totalCorrectAsterisks: 0,
      totalCorrectSecondHalf: 0,
      totalChanges: 0,
      roundResults: [],
      userEmail: contestantAnswers.id,
      beerScores: {},
      isTied: false,
      tieBreakerReason: null,
    };

    summary.roundResults = contestantAnswers?.beers.map(
      (roundAnswer, roundIndex) => {
        const correctBeer = correctBeers[roundIndex];
        const asterisked = (contestantAnswers?.asterisks[roundIndex] ||
          false) as boolean;
        const tasteScore = contestantAnswers?.ratings[roundIndex] || 4;
        const changes = contestantAnswers?.changes[roundIndex] as number;
        const correct = (roundAnswer === correctBeer) as boolean;
        const points =
          (correct ? 1 : 0) +
          (correct && asterisked ? 1 : 0) +
          (!correct && asterisked ? -1 : 0);

        // (Usually round 6 or higher)
        const isSecondHalf = roundIndex >= rounds / 2;
        summary.totalPoints += points;
        summary.totalTaste += tasteScore;
        summary.totalCorrectAsterisks += correct && asterisked ? 1 : 0;
        summary.totalCorrectSecondHalf += correct && isSecondHalf ? 1 : 0;
        summary.totalChanges += changes || 0;
        summary.beerScores[correctBeer] =
          (summary.beerScores[correctBeer] || 0) + tasteScore;

        return {
          index: roundIndex,
          selectedBeer: roundAnswer,
          correctBeer: correctBeer,
          correct: correct,
          tasteScore: tasteScore,
          asterisked: asterisked,
          points: points,
          changesMade: changes,
        } as RoundResult;
      }
    );

    return summary;
  }) as ResultSummary[];
};

export const createBeerScoreResults = (
  correctBeers: string[],
  contestantAnswers: ContestantAnswers[]
): BeerRanking[] =>
  correctBeers.map((correctBeer, index) => {
    const points = contestantAnswers.reduce(
      (total, contestant) => total + (contestant.ratings[index] || 4),
      0
    );
    return {name: correctBeer, points: points};
  });

export const sortByRankedPointScores = (
  contestantRoundResults: ResultSummary[] = []
) =>
  /* NOTE FOR SORTING:
   * If the result is negative, r1 is sorted
   * before r2.
   * If the result is positive, r2 is sorted
   * before r1.
   * If the result is 0, no changes are done
   * with the sort order of the two values.
   */
  contestantRoundResults.sort(
    (r1: ResultSummary, r2: ResultSummary): number => {
      if (r2.totalPoints !== r1.totalPoints) {
        // Base on points if not tied. Based
        // on scoring rules 1 and 2 (see
        // createContestantRoundResults)
        return r2.totalPoints - r1.totalPoints;
      } else {
        r1.isTied = true;
        r2.isTied = true;
        // If points are tied than base on total
        // asterisks (less wins). Based tie breaker rule 1.
        if (r2.totalCorrectAsterisks !== r1.totalCorrectAsterisks) {
          const result = r1.totalCorrectAsterisks - r2.totalCorrectAsterisks;
          (result > 0 ? r2 : r1).tieBreakerReason =
            TIE_BREAKER_REASON_LESS_ASTERISKS;
          return result;
        } else {
          // If points and total asterisks are tied than base
          // on total correct beers in second half (more wins).
          // Based tie breaker rule 2.
          if (r2.totalCorrectSecondHalf !== r1.totalCorrectSecondHalf) {
            const result =
              r2.totalCorrectSecondHalf - r1.totalCorrectSecondHalf;
            (result > 0 ? r2 : r1).tieBreakerReason =
              TIE_BREAKER_REASON_MORE_CORRECT_SECOND_HALF;
            return result;
          } else {
            r1.tieBreakerReason = DRINK_OFF;
            r2.tieBreakerReason = DRINK_OFF;
            // Drink off.
            return 0;
          }
        }
      }
    }
  );

export const sortByRankedBeerTasteScores = (
  beerScoreResults: BeerRanking[] = []
): BeerRanking[] =>
  beerScoreResults.sort(({points: p1}, {points: p2}) => p1 - p2);
