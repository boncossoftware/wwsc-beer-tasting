export type TastingEvent = {
    id: string;
    owner: string|undefined|null;
    name: string|undefined|null;
    related: string[]|undefined|null;
    bartender: string|undefined|null;
    tasters: string[]|undefined|null;
    ownerAddedAsTaster: boolean|undefined|null;
    beers: string[]|undefined|null;
    asterisksAllowed: number|undefined|null;
    editingAllowed: boolean|undefined|null;
    rounds: number|undefined|null;
}
export interface BarTenderAnswers {
    id: string,
    beers: string[]
}

export interface ContestantAnswers extends BarTenderAnswers {
    asterisks: (boolean|null)[],
    ratings: (number|null)[],
    changes: (number|null)[],
}

export interface RoundResult {
    index: number,
    selectedBeer: string,
    correctBeer: string,
    correct: boolean,
    tasteScore: number,
    asterisked: boolean,
    points: number,
    changesMade: number,
}

export interface ResultSummary {
    userEmail: string,
    totalPoints: number,
    totalTaste: number,
    totalAsterisks: number,
    totalAsterisksSecondHalf: number,
    totalChanges: number,
    roundResults: RoundResult[],
    beerScores: {[id:string]: number};
}

export interface BeerRanking {
    name: string,
    points: number
}

export interface TastingResults {
    roundResults: ResultSummary[],
    beerScoreResults: BeerRanking[]
}

