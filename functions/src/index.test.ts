//Set the firebase env variables to silince warnings before loading it in.
process.env.FIREBASE_CONFIG = "{}";
process.env.GCLOUD_PROJECT = "";

const {calculateContestantRoundResults} = require('./index');

const CORRECT_BEERS = [
    'Heineken',
    'Balashi',
    'Chill',
    'La Choufe',
    'Franziskaner Weissbier',
    'Amstel Bright'
];

const CONTESTANT_ANSWERS = [
    {
        id: 'contestant_1',
        beers: CORRECT_BEERS, //All correct beeers.
        asterisks: [true, true, null, null, null, null], //All correct asterisks.
        ratings: [4,4,4,4,4,4], //All high ratings.
        changes: [1,1,1,1,1,1], //All low change counts.
    },
    {
        id: 'contestant_2', //Contestant 1 in reverse.
        beers: CORRECT_BEERS.slice().reverse(), //All wrong beers.
        asterisks: [null, null, null, null, true, true], //All incorrect asterisks (in second half).
        ratings: [0,0,0,0,0,0], //All low ratings.
        changes: [5,5,5,5,5,5], //All high change counts.
    }
]

interface BarTenderAnswers {   
    id: string, 
    beers: [string]
}

interface ContestantAnswers extends BarTenderAnswers {
    asterisks: boolean[],
    ratings: number[],
    changes: number[],
}   


test('calculateContestantRoundResults()', () => {
    const results = calculateContestantRoundResults(CORRECT_BEERS, CONTESTANT_ANSWERS);
    expect(results[0].totalPoints).toBe(8); //All 6 correct + 2 correct asterisks.
    expect(results[0].totalPoints).toBe(8); //All 6 correct + 2 correct asterisks.
    
    expect(results[0].totalTaste).toBe(0); //All high scores converted to warawara-scores (4 - score).
    expect(results[1].totalTaste).toBe(6*4); //All low scores converted to warawara-scores (4 - score).

    expect(results[0].totalAsterisks).toBe(2);
    expect(results[0].totalAsterisksSecondHalf).toBe(0);

    expect(results[1].totalAsterisks).toBe(2);
    expect(results[1].totalAsterisksSecondHalf).toBe(2);

    console.log(results, results[0].roundResults, results[1].roundResults);
});