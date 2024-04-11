export type TastingEvent = {
  id: string;
  owner: string | undefined | null;
  name: string | undefined | null;
  related: string[] | undefined | null;
  bartender: string | undefined | null;
  tasters: string[] | undefined | null;
  beers: string[] | undefined | null;
  asterisksAllowed: number | undefined | null;
  editingAllowed: boolean | undefined | null;
  rounds: number | undefined | null;
};
export interface BarTenderAnswers {
  id: string;
  beers: string[];
}

export interface ContestantAnswers extends BarTenderAnswers {
  asterisks: (boolean | null)[];
  ratings: (number | null)[];
  changes: (number | null)[];
}

export interface RoundResult {
  index: number;
  selectedBeer: string;
  correctBeer: string;
  correct: boolean;
  tasteScore: number;
  asterisked: boolean;
  points: number;
  changesMade: number;
}

export interface ResultSummary {
  userEmail: string;
  totalPoints: number;
  totalTaste: number;
  totalCorrectAsterisks: number;
  totalCorrectSecondHalf: number;
  totalChanges: number;
  roundResults: RoundResult[];
  beerScores: { [id: string]: number };
  isTied: boolean;
  tieBreakerReason: string | null;
}

export interface BeerRanking {
  name: string;
  points: number;
}

export interface TastingResults {
  roundResults: ResultSummary[];
  beerScoreResults: BeerRanking[];
  lastUpdated: { seconds: number; nanoseconds: number };
}

export interface ServerError {
  error: {
    message: string;
    code: number;
  };
}

export const CORRECT_BEERS = [
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

export const CONTESTANT_ANSWERS: ContestantAnswers[] = [
  {
    id: "contestant_1@email.com",
    beers: CORRECT_BEERS, // All correct beeers.
    // All correct asterisks.
    asterisks: [true, true, null, null, null, null, null, null, null, null],
    ratings: [1, 1, 1, 1, 1, 2, 3, 4, 4, 4],
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // All low change counts.
  },
  {
    id: "contestant_2@email.com", // Contestant 1 in reverse.
    beers: CORRECT_BEERS.slice().reverse(), // All wrong beers.
    // All incorrect asterisks (in second half).
    asterisks: [null, null, null, null, null, null, null, null, true, true],
    ratings: [1, 2, 3, 4, 4, 4, 4, 4, 4, 4],
    changes: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5], // All high change counts.
  },
];

export const CONTESTANT_ANSWERS_TIE_BREAKER_ASTERISK: ContestantAnswers[] = [
  {
    id: "contestant_1@email.com",
    beers: CORRECT_BEERS,
    // Has less asterisks.
    asterisks: [null, null, null, null, null, null, null, null, null, null],
    ratings: [1, 1, 1, 1, 1, 2, 3, 4, 4, 4],
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: "contestant_2@email.com",
    beers: [
      ...CORRECT_BEERS.slice(0, 8),
      ...CORRECT_BEERS.slice(0, 2), // These are incorrect
    ],
    // All incorrect asterisks (in second half).
    asterisks: [true, true, null, null, null, null, null, null, null, null],
    ratings: [1, 2, 3, 4, 4, 4, 4, 4, 4, 4],
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
];

export const CONTESTANT_ANSWERS_TIE_BREAKER_SECOND_HALF: ContestantAnswers[] = [
  {
    id: "contestant_1@email.com",
    beers: [
      ...CORRECT_BEERS.slice(8, 10), // These are incorrect on
      ...CORRECT_BEERS.slice(2, 10),
    ],
    asterisks: [null, null, null, null, null, null, null, null, null, null],
    ratings: [1, 1, 1, 1, 1, 2, 3, 4, 4, 4],
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: "contestant_2@email.com",
    beers: [
      ...CORRECT_BEERS.slice(0, 8),
      ...CORRECT_BEERS.slice(0, 2), // These are incorrect on
    ],
    asterisks: [null, null, null, null, null, null, null, null, null, null],
    ratings: [1, 2, 3, 4, 4, 4, 4, 4, 4, 4],
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
];

export const WSC_VIRTUAL_BBT_CORRECT_BEERS = [
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

export const WSC_VIRTUAL_BBT_ANSWERS = [
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
    ratings: [1, 4, 2, 4, 2, 3, 4, 3, 2, 1],
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
    ratings: [1, 3, 1, 2, 2, 4, 3, 2, 2, 2],
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
    ratings: [4, 4, 3, 3, 3, 3, 3, 3, 3, 3],
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
    ratings: [1, 2, 1, 2, 3, 4, 2, 3, 1, 2],
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
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
    ],
    ratings: [2, 2, 2, 2, 3, 3, 3, 2, 1, 2],
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
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
    ],
    ratings: [1, 3, 1, 3, 3, 4, 3, 3, 1, 3],
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
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
    ],
    ratings: [1, 3, 1, 2, 2, 4, 3, 3, 1, 3],
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
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    ratings: [2, 1, 1, 1, 4, 4, 4, 4, 3, 4],
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
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      true,
    ],
    ratings: [3, 2, 2, 3, 4, 4, 4, 1, 1, 2],
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
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ],
    ratings: [2, 2, 1, 2, 2, 2, 3, 2, 1, 1],
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
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
    ],
    ratings: [2, 4, 3, 3, 3, 2, 3, 2, 1, 2],
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
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    ratings: [1, 2, 2, 2, 3, 3, 2, 3, 2, 2],
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
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
    ],
    ratings: [1, 3, 1, 1, 2, 4, 3, 2, 2, 4],
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
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    ratings: [1, 2, 1, 2, 3, 4, 4, 4, 4, 3],
    changes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // falset available, asume 1.
  },
];
