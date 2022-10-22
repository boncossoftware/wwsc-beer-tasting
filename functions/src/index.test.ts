// Set the firebase env variables to silince warnings before loading it in.
process.env.FIREBASE_CONFIG = "{}";
process.env.GCLOUD_PROJECT = "";
console.debug = jest.fn(); // Prevent loggin to console.
console.error = jest.fn(); // Prevent loggin to console.
// Mock the tasting event and answers fetched from firebase.
const dataService = {
  getTastingEvent: () => ({
    bartender: "bartender@email.com",
  }),
  getTastingEventAnswers: () => [
    ...CONTESTANT_ANSWERS,
    {
      id: "bartender@email.com",
      beers: CORRECT_BEERS,
    } as ContestantAnswers,
  ],
  getCurrentTimestamp: () => ({ seconds: 0, nanoseconds: 0 }),
  setResults: () => null,
};
jest.mock("./data-service", () => dataService);

import { sortByRankedPointScores, TIE_BREAKER_REASON_LESS_ASTERISKS, TIE_BREAKER_REASON_MORE_CORRECT_SECOND_HALF } from ".";
import {
  ContestantAnswers,
  CONTESTANT_ANSWERS,
  CONTESTANT_ANSWERS_TIE_BREAKER_ASTERISK,
  CONTESTANT_ANSWERS_TIE_BREAKER_SECOND_HALF,
  CORRECT_BEERS,
  ServerError,
  TastingResults,
  WSC_VIRTUAL_BBT_ANSWERS,
  WSC_VIRTUAL_BBT_CORRECT_BEERS,
} from "./model";

const firebaseTest = require("firebase-functions-test")();

test("calculateContestantRoundResults()", () => {
  const { createContestantRoundResults } = require(".");
  const results = createContestantRoundResults(
    CORRECT_BEERS,
    CONTESTANT_ANSWERS
  );
  // All 10 correct + 2 correct asterisks.
  expect(results[0].totalPoints).toBe(12);
  // All 10 incorrect + 2 incorrect asterisks.
  expect(results[1].totalPoints).toBe(-2);

  expect(results[0].totalTaste).toBe(22);
  // All low scores converted to warawara-scores (4 - score).
  expect(results[1].totalTaste).toBe(34);

  expect(results[0].totalCorrectAsterisks).toBe(2);
  expect(results[0].totalCorrectSecondHalf).toBe(5);
  
  expect(results[1].totalCorrectAsterisks).toBe(0);
  expect(results[1].totalCorrectSecondHalf).toBe(0);
});

test("calculateBeerScoreResults()", () => {
  const { createBeerScoreResults } = require(".");
  const results = createBeerScoreResults(CORRECT_BEERS, CONTESTANT_ANSWERS);
  expect(results[0].points).toBe(2);
  expect(results[1].points).toBe(3);
  expect(results[2].points).toBe(4);
  expect(results[3].points).toBe(5);
  expect(results[4].points).toBe(5);
  expect(results[5].points).toBe(6);
  expect(results[6].points).toBe(7);
  expect(results[7].points).toBe(8);
  expect(results[8].points).toBe(8);
  expect(results[9].points).toBe(8);
});

test("BBT Vitrual event - calculateContestantRoundResults()", () => {
  const {
    createContestantRoundResults,
    sortByRankedPointScores, // eslint-disable-line no-unused-vars,
  } = require(".");
  const results = createContestantRoundResults(
    WSC_VIRTUAL_BBT_CORRECT_BEERS,
    WSC_VIRTUAL_BBT_ANSWERS
  );
  sortByRankedPointScores(results);

  expect(results[0].totalPoints).toBe(10);
  expect(results[0].totalCorrectAsterisks).toBe(1);
  expect(results[0].totalCorrectSecondHalf).toBe(5);
  expect(results[0].totalTaste).toBe(28);

  expect(results[1].totalPoints).toBe(8);
  expect(results[1].totalCorrectAsterisks).toBe(2);
  expect(results[1].totalCorrectSecondHalf).toBe(3);
  expect(results[1].totalTaste).toBe(18);

  expect(results[2].totalPoints).toBe(8);
  expect(results[2].totalCorrectAsterisks).toBe(2);
  expect(results[2].totalCorrectSecondHalf).toBe(2);
  expect(results[2].totalTaste).toBe(22);
});

test("event - createTastingResults()", async () => {
  const { calculateResults } = require(".");
  const wrappedCalculateResults = firebaseTest.wrap(calculateResults);
  const eventID = "1";
  const results: TastingResults = await wrappedCalculateResults(eventID);
  expect(results.roundResults[0].userEmail).toBe(CONTESTANT_ANSWERS[0].id);
  expect(results.roundResults[1].userEmail).toBe(CONTESTANT_ANSWERS[1].id);

  expect(results.beerScoreResults[0].name).toBe(CORRECT_BEERS[0]);
  expect(results.beerScoreResults[1].name).toBe(CORRECT_BEERS[1]);
});

test("event with no bartender - createTastingResults()", async () => {
  dataService.getTastingEventAnswers = () => CONTESTANT_ANSWERS;
  const { calculateResults } = require(".");
  const wrappedCalculateResults = firebaseTest.wrap(calculateResults);
  const eventID = "1";
  const results = (await wrappedCalculateResults(eventID)) as ServerError;

  expect(results.error).toBeTruthy();
  expect(results.error.code).toBe(1500);
});

test("In a tie the participant with least asterisks should win.", async () => {
  const { createContestantRoundResults } = require(".");
  const results = createContestantRoundResults(
    CORRECT_BEERS,
    CONTESTANT_ANSWERS_TIE_BREAKER_ASTERISK
  );
  const sortedResults = sortByRankedPointScores(results);

  expect(sortedResults[0].userEmail).toBe("contestant_1@email.com");//Winner
  expect(sortedResults[0].isTied).toBe(true);
  expect(sortedResults[1].isTied).toBe(true);
  expect(sortedResults[0].tieBreakerReason).toBe(
    TIE_BREAKER_REASON_LESS_ASTERISKS
  );
  expect(sortedResults[1].tieBreakerReason).toBe(null);
});

test("In a tie the participant with same asterisks then most correct beers in second half should win.", async () => {
  const { createContestantRoundResults } = require(".");
  const results = createContestantRoundResults(
    CORRECT_BEERS,
    CONTESTANT_ANSWERS_TIE_BREAKER_SECOND_HALF
  );
  const sortedResults = sortByRankedPointScores(results);

  expect(sortedResults[0].userEmail).toBe("contestant_1@email.com"); //Winner
  expect(sortedResults[0].isTied).toBe(true);
  expect(sortedResults[1].isTied).toBe(true);
  expect(sortedResults[0].tieBreakerReason).toBe(
    TIE_BREAKER_REASON_MORE_CORRECT_SECOND_HALF
  );
  expect(sortedResults[1].tieBreakerReason).toBe(null);
});
