// Set the firebase env variables to silince warnings before loading it in.
process.env.FIREBASE_CONFIG = "{}";
process.env.GCLOUD_PROJECT = "";
console.debug = jest.fn(); //Prevent loggin to console.

import {
  createContestantRoundResults,
  //rankedPointsSorting,
  createBeerScoreResults,
  sortByRankedPointScores, // eslint-disable-line no-unused-vars,
} from ".";
import {
    ContestantAnswers, TastingResults
} from "./model";

const firebaseTest = require('firebase-functions-test')();

const CORRECT_BEERS = [
  "Augustiner Helles Lager",
  "Becks Pils",
  "Erdinger Weissbier hell",
  "Krombacher dunkel",
  "Paulaner Muenchner Helles Lager",
  "Jever Pils",
  "Rothaus Tanne Zapfle",
  "Diebels Altbier",
  "Weihenstephaner Weissbier hell",
  "Bitburger Pilsener",
];

const CONTESTANT_ANSWERS: ContestantAnswers[] = [
  {
    id: "contestant_1@email.com",
    beers: CORRECT_BEERS, // All correct beeers.
    // All correct asterisks.
    asterisks: [true, true, null, null, null, null, null, null, null, null],
    ratings: [4, 4, 4, 4, 4, 3, 2, 1, 0, 0],
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // All low change counts.
  },
  {
    id: "contestant_2@email.com", // Contestant 1 in reverse.
    beers: CORRECT_BEERS.slice().reverse(), // All wrong beers.
    // All incorrect asterisks (in second half).
    asterisks: [null, null, null, null, null, null, null, null, true, true],
    ratings: [4, 3, 2, 1, 0, 0, 0, 0, 0, 0],
    changes: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5], // All high change counts.
  },
];

const toRatings = (arr: number[]) => arr.map( (v) => Math.max(0, 4 - v));

const WSC_VIRTUAL_BBT_CORRECT_BEERS = [
  "Augustiner Helles Lager",
  "Becks Pils",
  "Erdinger Weissbier hell",
  "Krombacher dunkel",
  "Paulaner Muenchner Helles Lager",
  "Jever Pils",
  "Rothaus Tanne Zapfle",
  "Diebels Altbier",
  "Weihenstephaner Weissbier hell",
  "Bitburger Pilsener",
];

const WSC_VIRTUAL_BBT_ANSWERS = [
  {
    id: "Ryan Alexander",
    beers: [
      "Paulaner Muenchner Helles Lager",
      "Bitburger Pilsener",
      "Weihenstephaner Weissbier hell",
      "Diebels Altbier",
      "Augustiner Helles Lager",
      "Rothaus Tanne Zapfle",
      "Jever Pils",
      "Krombacher dunkel",
      "Erdinger Weissbier hell",
      "Becks Pils",
    ],
    asterisks: [null, null, true, null, null, null, null, null, null, null],
    ratings: toRatings([1, 4, 2, 4, 2, 3, 4, 3, 2, 1]),
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
  {
    id: "Dwight",
    beers: [
      "Paulaner Muenchner Helles Lager",
      "Becks Pils",
      "Weihenstephaner Weissbier hell",
      "Krombacher dunkel",
      "Augustiner Helles Lager",
      "Jever Pils",
      "Bitburger Pilsener",
      "Diebels Altbier",
      "Erdinger Weissbier hell",
      "Rothaus Tanne Zapfle",
    ],
    asterisks: [null, null, null, null, null, null, null, null, true, null],
    ratings: toRatings([1, 3, 1, 2, 2, 4, 3, 2, 2, 2]),
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
  {
    id: "Danilo (papi) Werleman",
    beers: [
      "Bitburger Pilsener",
      "Becks Pils",
      "Erdinger Weissbier hell",
      "Krombacher dunkel",
      "Augustiner Helles Lager",
      "Jever Pils",
      "Rothaus Tanne Zapfle",
      "Diebels Altbier",
      "Weihenstephaner Weissbier hell",
      "Paulaner Muenchner Helles Lager",
    ],
    asterisks: [null, null, null, null, null, null, null, null, null, null],
    ratings: toRatings([4, 4, 3, 3, 3, 3, 3, 3, 3, 3]),
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
  {
    id: "Zairo",
    beers: [
      "Paulaner Muenchner Helles Lager",
      "Becks Pils",
      "Erdinger Weissbier hell",
      "Krombacher dunkel",
      "Jever Pils",
      "Rothaus Tanne Zapfle",
      "Bitburger Pilsener",
      "Diebels Altbier",
      "Weihenstephaner Weissbier hell",
      "Augustiner Helles Lager",
    ],
    asterisks: [false, null, true, null, null, null, null, null, null, null],
    ratings: toRatings([1, 2, 1, 2, 3, 4, 2, 3, 1, 2]),
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
  {
    id: "Israel",
    beers: [
      "Bitburger Pilsener",
      "Becks Pils",
      "Erdinger Weissbier hell",
      "Krombacher dunkel",
      "Augustiner Helles Lager",
      "Rothaus Tanne Zapfle",
      "Augustiner Helles Lager",
      "Diebels Altbier",
      "Weihenstephaner Weissbier hell",
      "Paulaner Muenchner Helles Lager",
    ],
    asterisks: [
      false, false, false, true, false, false, false, true, false, false,
    ],
    ratings: toRatings([2, 2, 2, 2, 3, 3, 3, 2, 1, 2]),
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
  {
    id: "JURGEN",
    beers: [
      "Paulaner Muenchner Helles Lager",
      "Bitburger Pilsener",
      "Weihenstephaner Weissbier hell",
      "Diebels Altbier",
      "Augustiner Helles  Lager",
      "Becks Pils",
      "Jever Pils",
      "Krombacher dunkel",
      "Erdinger Weissbier hell",
      "Rothaus Tanne Zapfle",
    ],
    asterisks: [
      false, false, true, false, false, false, false, false, true, false,
    ],
    ratings: toRatings([1, 3, 1, 3, 3, 4, 3, 3, 1, 3]),
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
  {
    id: "Tristan Every",
    beers: [
      "Augustiner Helles Lager",
      "Becks Pils",
      "Weihenstephaner Weissbier hell",
      "Krombacher dunkel",
      "Paulaner Muenchner Helles Lager",
      "Bitburger Pilsener",
      "Jever Pils",
      "Diebels Altbier",
      "Erdinger Weissbier hell",
      "Rothaus Tanne Zapfle",
    ],
    asterisks: [
      false, false, false, true, false, false, false, true, false, false,
    ],
    ratings: toRatings([1, 3, 1, 2, 2, 4, 3, 3, 1, 3]),
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
  {
    id: "Elton",
    beers: [
      "Paulaner Muenchner Helles Lager",
      "Becks Pils",
      "Erdinger Weissbier hell",
      "Krombacher dunkel",
      "Paulaner Muenchner Helles Lager",
      "Jever Pils",
      "Rothaus Tanne Zapfle",
      "Diebels Altbier",
      "Weihenstephaner Weissbier hell",
      "Bitburger Pilsener",
    ],
    asterisks: [
      false, false, true, false, false, false, false, false, false, false,
    ],
    ratings: toRatings([2, 1, 1, 1, 4, 4, 4, 4, 3, 4]),
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
  {
    id: "Geoffrey Wever",
    beers: [
      "Rothaus Tanne Zapfle",
      "Diebels Altbier",
      "Jever Pils",
      "Erdinger Weissbier hell",
      "Becks Pils",
      "Augustiner Helles Lager",
      "Rothaus Tanne Zapfle",
      "Krombacher dunkel",
      "Weihenstephaner Weissbier hell",
      "Bitburger Pilsener",
    ],
    asterisks: [
      false, false, false, false, false, false, false, true, false, true,
    ],
    ratings: toRatings([3, 2, 2, 3, 4, 4, 4, 1, 1, 2]),
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
  {
    id: "Kevin Perret",
    beers: [
      "Jever Pils",
      "Becks Pils",
      "Weihenstephaner Weissbier hell",
      "Krombacher dunkel",
      "Paulaner Muenchner Helles Lager",
      "Bitburger Pilsener",
      "Rothaus Tanne Zapfle",
      "Diebels Altbier",
      "Erdinger Weissbier hell",
      "Bitburger Pilsener",
    ],
    asterisks: [
      false, false, false, true, true, false, false, false, false, false,
    ],
    ratings: toRatings([2, 2, 1, 2, 2, 2, 3, 2, 1, 1]),
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
  {
    id: "Emile de Cuba",
    beers: [
      "Paulaner Muenchner Helles Lager",
      "Becks Pils",
      "Erdinger Weissbier hell",
      "Krombacher dunkel",
      "Jever Pils",
      "Bitburger Pilsener",
      "Rothaus Tanne Zapfle",
      "Diebels Altbier",
      "Weihenstephaner Weissbier hell",
      "Augustiner Helles Lager",
    ],
    asterisks: [
      false, false, false, false, true, false, false, false, true, false,
    ],
    ratings: toRatings([2, 4, 3, 3, 3, 2, 3, 2, 1, 2]),
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
  {
    id: "Alex Brokke",
    beers: [
      "Augustiner Helles Lager",
      "Becks Pils",
      "Weihenstephaner Weissbier hell",
      "Krombacher dunkel",
      "Paulaner Muenchner Helles Lager",
      "Jever Pils",
      "Bitburger Pilsener",
      "Diebels Altbier",
      "Erdinger Weissbier hell",
      "Rothaus Tanne Zapfle",
    ],
    asterisks: [
      true, true, false, false, false, false, false, false, false, false,
    ],
    ratings: toRatings([1, 2, 2, 2, 3, 3, 2, 3, 2, 2]),
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
  {
    id: "Tristan Every",
    beers: [
      "Rothaus Tanne Zapfle",
      "Augustiner Helles Lager",
      "Becks Pils",
      "Weihenstephaner Weissbier hell",
      "Krombacher dunkel",
      "Paulaner Muenchner Helles Lager",
      "Rothaus Tanne Zapfle",
      "Jever Pils",
      "Diebels Altbier",
      "Erdinger Weissbier hell",
    ],
    asterisks: [
      false, false, false, true, false, false, false, true, false, false,
    ],
    ratings: toRatings([1, 3, 1, 1, 2, 4, 3, 2, 2, 4]),
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
  {
    id: "Walter Peña",
    beers: [
      "Bitburger Pilsener",
      "Becks Pils",
      "Erdinger Weissbier hell",
      "Bubbly Diebels Altbier",
      "Jever Pils",
      "Augustiner Helles Lager",
      "Krombacher dunkel",
      "Weihenstephaner Weissbier hell",
      "Rothaus Tanne Zapfle",
      "Paulaner Muenchner Helles Lager",
    ],
    asterisks: [
      true, true, false, false, false, false, false, false, false, false,
    ],
    ratings: toRatings([1, 2, 1, 2, 3, 4, 4, 4, 4, 3]),
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
];

//Mock the tasting event and answers fetched from firebase.
jest.mock('./data-service', () => ({
    getTastingEvent: () => ({
        bartender: 'bartender@email.com'
    }),
    getTastingEventAnswers: () => [
        ...CONTESTANT_ANSWERS,
        {
            id: 'bartender@email.com',
            beers: CORRECT_BEERS
        }
    ],
    setResults: () => null,
}));



test("calculateContestantRoundResults()", () => {
  const results = createContestantRoundResults(
      CORRECT_BEERS,
      CONTESTANT_ANSWERS
  );
  // All 10 correct + 2 correct asterisks.
  expect(results[0].totalPoints).toBe(12);
  // All 10 incorrect + 2 incorrect asterisks.
  expect(results[1].totalPoints).toBe(-2);

  expect(results[0].totalTaste).toBe(14);
  // All low scores converted to warawara-scores (4 - score).
  expect(results[1].totalTaste).toBe(30);

  expect(results[0].totalAsterisks).toBe(2);
  expect(results[0].totalAsterisksSecondHalf).toBe(0);

  expect(results[1].totalAsterisks).toBe(2);
  expect(results[1].totalAsterisksSecondHalf).toBe(2);
});

test("calculateBeerScoreResults()", () => {
  const results = createBeerScoreResults(CORRECT_BEERS, CONTESTANT_ANSWERS);
  expect(results[0].points).toBe(0);
  expect(results[1].points).toBe(1);
  expect(results[2].points).toBe(2);
  expect(results[3].points).toBe(3);
  expect(results[4].points).toBe(4);
  expect(results[5].points).toBe(5);
  expect(results[6].points).toBe(6);
  expect(results[7].points).toBe(7);
  expect(results[8].points).toBe(8);
  expect(results[9].points).toBe(8);
});


test("calculateContestantRoundResults() on BBT Vitrual event", () => {
  const results = createContestantRoundResults(
      WSC_VIRTUAL_BBT_CORRECT_BEERS,
      WSC_VIRTUAL_BBT_ANSWERS
  );
  sortByRankedPointScores(results);

  expect(results[0].totalPoints).toBe(10);
  expect(results[0].totalAsterisks).toBe(1);
  expect(results[0].totalAsterisksSecondHalf).toBe(0);
  expect(results[0].totalTaste).toBe(28);

  expect(results[1].totalPoints).toBe(8);
  expect(results[1].totalAsterisks).toBe(2);
  expect(results[1].totalAsterisksSecondHalf).toBe(0);
  expect(results[1].totalTaste).toBe(18);

  expect(results[2].totalPoints).toBe(8);
  expect(results[2].totalAsterisks).toBe(2);
  expect(results[2].totalAsterisksSecondHalf).toBe(0);
  expect(results[2].totalTaste).toBe(22);
  
});


test("createTastingResults() on BBT Vitrual event", async () => {
    const { calculateResults } = require('.');
    const wrappedCalculateResults = firebaseTest.wrap(calculateResults);
    const eventID = '1';
    const results: TastingResults = await wrappedCalculateResults(eventID);
    
    expect(results.roundResults[0].userEmail).toBe(CONTESTANT_ANSWERS[0].id);
    expect(results.roundResults[1].userEmail).toBe(CONTESTANT_ANSWERS[1].id);

    expect(results.beerScoreResults[0].name).toBe(CORRECT_BEERS[0]);
    expect(results.beerScoreResults[1].name).toBe(CORRECT_BEERS[1]);
});
