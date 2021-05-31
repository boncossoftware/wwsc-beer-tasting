import * as functions from "firebase-functions";
import {
    ContestantAnswers,
    RoundResult,
    ResultSummary,
    BeerRanking,
    TastingResults,
    ServerError
} from './model';
import {
    getCurrentTimestamp,
    getTastingEvent,
    getTastingEventAnswers,
    setResults
} from './data-service';

const onCall = functions.https.onCall;

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
    constructor(message:string, code: number) {
      super(message);
      this.code = code;
    }
}

export const calculateResults = onCall(async (data, _) => {
  // Get all answers.
  const id = data;

  try {
    //Fetch event & answers
    functions.logger.debug(`fetching answers (${id})`);
    let [event, answers] = await Promise.all([
        getTastingEvent(id),
        getTastingEventAnswers(id)
    ]);
    functions.logger.debug(`answers fetched (${id})`);

    //Get the correct order of beers.
    const barTenderAnswers = answers.find( a => a.id === event.bartender);
    validateBarTenderAnswers(barTenderAnswers);

    const correctBeers = barTenderAnswers?.beers;
    functions.logger.debug(`answers valid (${id})`);

    //clear out the bartender's answers and owner answers if needed.
    const exludeEmails = [event.bartender, (event.ownerAddedAsTaster && event.owner)];
    answers = answers.filter( a => !exludeEmails.includes(a.id))
    
    // Create the tasting results
    const roundResults = createContestantRoundResults(correctBeers!, answers);
    sortByRankedPointScores(roundResults);
    const beerScoreResults = createBeerScoreResults(correctBeers!, answers);
    sortByRankedBeerTasteScores(beerScoreResults);
    const tastingResults = {
        roundResults,
        beerScoreResults,
        lastUpdated: getCurrentTimestamp()
    } as TastingResults
    functions.logger.debug(`results created (${id})`);

    //Save the results.
    setResults(id, tastingResults);
    functions.logger.debug(`results saved (${id})`);

    //Reply with the results.
    return tastingResults;
  } catch (error) {
    const message = (error as ResultsError).message;
    const code = (error as ResultsError).code;
    functions.logger.error(`Error: ${message} (${code})\n ${error.stack}`);
    
    return {error: {message, code}} as ServerError;
  }
});

export const validateBarTenderAnswers = (anwsers: ContestantAnswers | undefined) => {
  if(anwsers?.beers === undefined){ 
    throw new ResultsError("No answers found for bartender.", 1500);
  }
  functions.logger.debug(`bartender has answers (${anwsers.id})`);

  // Make sure every beer is set.
  const allBeersSet = anwsers?.beers
    ?.map( (b) => b?.length > 0 )
    ?.every( (set) => set );
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
  return (contestantAnswers||[]).map(
      (contestantAnswers) => {
        const summary: ResultSummary = {
          totalPoints: 0,
          totalTaste: 0,
          totalAsterisks: 0,
          totalAsterisksSecondHalf: 0,
          totalChanges: 0,
          roundResults: [],
          userEmail: contestantAnswers.id,
          beerScores: {},
        };

        summary.roundResults = contestantAnswers?.beers.map(
            (roundAnswer, roundIndex) => {
              const correctBeer = correctBeers[roundIndex];
              const asterisked = (
                  contestantAnswers?.asterisks[roundIndex] ||
                  false
              );
              const tasteScore = Math.max(
                  0,
                  (4 - (contestantAnswers?.ratings[roundIndex]||0) )
              );
              const changes = contestantAnswers?.changes[roundIndex];
              const correct = (roundAnswer === correctBeer);
              const points =
                (correct?1:0) +
                ((correct && asterisked)?1:0) +
                ((!correct && asterisked)?-1:0);

              const isSecondHalf = roundIndex >= (rounds / 2);
              summary.totalPoints += points;
              summary.totalTaste += tasteScore;
              summary.totalAsterisks += asterisked?1:0;
              summary.totalAsterisksSecondHalf += (
                  asterisked &&
                  isSecondHalf
              )?1:0;
              summary.totalChanges += changes||0;
              summary.beerScores[correctBeer] =
            (summary.beerScores[correctBeer]||0) +
            tasteScore;

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
            });

        return summary;
      }
  ) as ResultSummary[];
};

export const createBeerScoreResults = (
    correctBeers: string[],
    contestantAnswers: ContestantAnswers[]
): BeerRanking[] => 
  correctBeers.map( (correctBeer, index) => {
      const points = contestantAnswers.reduce( 
          (total, contestant) => total + ( 4 - (contestant.ratings[index] || 0) )
      , 0);
      return {name: correctBeer, points: points};
  });

export const sortByRankedPointScores = (
    contestantRoundResults: ResultSummary[]=[]
) =>
  contestantRoundResults.sort(
      (r1: ResultSummary, r2: ResultSummary): number => {
        if (r2.totalPoints !== r1.totalPoints) {
          // Base on points if not tied.
          return r2.totalPoints - r1.totalPoints;
        } else {
          // If points are tied than base on total asterisks (less wins)
          if (r2.totalAsterisks !== r1.totalAsterisks) {
            return r1.totalAsterisksSecondHalf - r2.totalAsterisksSecondHalf;
          } else {
            // If points and total asterisks are tied than base
            // on total asterisks second half (less wins).
            if (r2.totalAsterisksSecondHalf !== r1.totalAsterisksSecondHalf) {
              return r1.totalAsterisksSecondHalf - r2.totalAsterisksSecondHalf;
            } else {
              // If points and total asterisks (second half) are tied than
              // base on total changes (less wins).
              if (r2.totalChanges !== r1.totalChanges) {
                return r1.totalChanges - r2.totalChanges;
              } else {
                // If all else fails thant base on total warawara taste
                // score (less wins).
                return r1.totalTaste - r2.totalTaste;
              }
            }
          }
        }
      });

export const sortByRankedBeerTasteScores = (
    beerScoreResults:BeerRanking[] = []
): BeerRanking[] =>
    beerScoreResults.sort( ({points:p1}, {points:p2}) => p1 - p2 );

