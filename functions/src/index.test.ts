//Set the firebase env variables to silince warnings before loading it in.
process.env.FIREBASE_CONFIG = "{}";
process.env.GCLOUD_PROJECT = "";

import { 
    calculateContestantRoundResults, 
    rankedPointsSorting, 
    calculateBeerScoreResults, 
    createTastingResults,
    ContestantAnswers
} from ".";

const CORRECT_BEERS = [
    'Augustiner Helles Lager',
    'Becks Pils',
    'Erdinger Weissbier hell',
    'Krombacher dunkel',
    'Paulaner Muenchner Helles Lager',
    'Jever Pils',
    'Rothaus Tanne Zapfle',
    'Diebels Altbier',
    'Weihenstephaner Weissbier hell',
    'Bitburger Pilsener'
];

const CONTESTANT_ANSWERS: ContestantAnswers[] = [
    {
        id: 'contestant_1',
        beers: CORRECT_BEERS, //All correct beeers.
        asterisks: [true, true, null, null, null, null, null, null, null, null], //All correct asterisks.
        ratings: [4,4,4,4,4,3,2,1,0,0],
        changes: [1,1,1,1,1,1,1,1,1,1], //All low change counts.
    },
    {
        id: 'contestant_2', //Contestant 1 in reverse.
        beers: CORRECT_BEERS.slice().reverse(), //All wrong beers.
        asterisks: [null, null, null, null, null, null, null, null, true, true], //All incorrect asterisks (in second half).
        ratings: [4,3,2,1,0,0,0,0,0,0], 
        changes: [5,5,5,5,5,5,5,5,5,5], //All high change counts.
    }
];

const toRatings = (arr: number[]) => arr.map( v => Math.max(0, 4 - v));

const WSC_VIRTUAL_BBT_CORRECT_BEERS = [
    'Augustiner Helles Lager',
    'Becks Pils',
    'Erdinger Weissbier hell',
    'Krombacher dunkel',
    'Paulaner Muenchner Helles Lager',
    'Jever Pils',
    'Rothaus Tanne Zapfle',
    'Diebels Altbier',
    'Weihenstephaner Weissbier hell',
    'Bitburger Pilsener'
];

const WSC_VIRTUAL_BBT_ANSWERS = [
    {
        id: 'Ryan Alexander',	
        beers: [
            'Paulaner Muenchner Helles Lager',
            'Bitburger Pilsener',	
            'Weihenstephaner Weissbier hell',
            'Diebels Altbier',
            'Augustiner Helles Lager',
            'Rothaus Tanne Zapfle',
            'Jever Pils',
            'Krombacher dunkel',
            'Erdinger Weissbier hell',
            'Becks Pils'
        ],
        asterisks: [null,null,true,null,null,null,null,null,null,null],
        ratings: toRatings([1,4,2,4,2,3,4,3,2,1]),
        changes: [1,1,1,1,1,1,1,1,1,1],//falset available, asume 1.
    },
    {
        id: 'Dwight',
        beers: [
            'Paulaner Muenchner Helles Lager',
            'Becks Pils',	
            'Weihenstephaner Weissbier hell',
            'Krombacher dunkel',
            'Augustiner Helles Lager',
            'Jever Pils',
            'Bitburger Pilsener',
            'Diebels Altbier',
            'Erdinger Weissbier hell',
            'Rothaus Tanne Zapfle',
        ],
        asterisks: [null,null,null,null,null,null,null,null,true,null],
        ratings: toRatings([1,3,1,2,2,4,3,2,2,2]),
        changes: [1,1,1,1,1,1,1,1,1,1],//falset available, asume 1.		
    },
    {
        id: 'Danilo (papi) Werleman',	
        beers: [
            'Bitburger Pilsener',
            'Becks Pils',
            'Erdinger Weissbier hell',
            'Krombacher dunkel',
            'Augustiner Helles Lager',
            'Jever Pils',
            'Rothaus Tanne Zapfle',
            'Diebels Altbier',
            'Weihenstephaner Weissbier hell',
            'Paulaner Muenchner Helles Lager'
        ],
        asterisks: [null,null,null,null,null,null,null,null,null,null],
        ratings: toRatings([4,4,3,3,3,3,3,3,3,3]),
        changes: [1,1,1,1,1,1,1,1,1,1],//falset available, asume 1.		
    },
    {
        id: 'Zairo', 
        beers: [
            'Paulaner Muenchner Helles Lager',
            'Becks Pils',
            'Erdinger Weissbier hell',
            'Krombacher dunkel',
            'Jever Pils',
            'Rothaus Tanne Zapfle',
            'Bitburger Pilsener',
            'Diebels Altbier',
            'Weihenstephaner Weissbier hell',
            'Augustiner Helles Lager',
        ],
        asterisks:[false,null,true,null,null,null,null,null,null,null],
        ratings: toRatings([1,2,1,2,3,4,2,3,1,2]),
        changes: [1,1,1,1,1,1,1,1,1,1],//falset available, asume 1.
    	},
    {
        id: 'Israel',
        beers: [
            'Bitburger Pilsener',
            'Becks Pils',
            'Erdinger Weissbier hell',
            'Krombacher dunkel',
            'Augustiner Helles Lager',
            'Rothaus Tanne Zapfle',
            'Augustiner Helles Lager',
            'Diebels Altbier',
            'Weihenstephaner Weissbier hell',
            'Paulaner Muenchner Helles Lager'
        ],
        asterisks: [false,false,false,true,false,false,false,true,false,false],
        ratings: toRatings([2,2,2,2,3,3,3,2,1,2]),
        changes: [1,1,1,1,1,1,1,1,1,1],//falset available, asume 1.	
    },
    {
        id: 'JURGEN',
        beers: [
            'Paulaner Muenchner Helles Lager' ,
            'Bitburger Pilsener',
            'Weihenstephaner Weissbier hell',
            'Diebels Altbier',
            'Augustiner Helles  Lager',
            'Becks Pils',
            'Jever Pils',
            'Krombacher dunkel',
            'Erdinger Weissbier hell',
            'Rothaus Tanne Zapfle'
        ],
        asterisks: [false,false,true,false,false,false,false,false,true,false],
        ratings: toRatings([1,3,1,3,3,4,3,3,1,3]),
        changes: [1,1,1,1,1,1,1,1,1,1],//falset available, asume 1.	
    },
    {
        id: 'Tristan Every',
        beers: [
            'Augustiner Helles Lager',
            'Becks Pils',
            'Weihenstephaner Weissbier hell',
            'Krombacher dunkel',
            'Paulaner Muenchner Helles Lager',
            'Bitburger Pilsener',
            'Jever Pils',
            'Diebels Altbier',
            'Erdinger Weissbier hell',
            'Rothaus Tanne Zapfle'
        ],
        asterisks: [false,false,false,true,false,false,false,true,false,false],
        ratings: toRatings([1,3,1,2,2,4,3,3,1,3]),
        changes: [1,1,1,1,1,1,1,1,1,1],//falset available, asume 1.	
    },
    {
        id: 'Elton',
        beers: [
            'Paulaner Muenchner Helles Lager',
            'Becks Pils',
            'Erdinger Weissbier hell',
            'Krombacher dunkel',
            'Paulaner Muenchner Helles Lager',
            'Jever Pils',
            'Rothaus Tanne Zapfle',
            'Diebels Altbier',
            'Weihenstephaner Weissbier hell',
            'Bitburger Pilsener'
        ],		
        asterisks: [false,false,true,false,false,false,false,false,false,false],
        ratings: toRatings([2,1,1,1,4,4,4,4,3,4]),
        changes: [1,1,1,1,1,1,1,1,1,1],//falset available, asume 1.	
    },
    {
        id: 'Geoffrey Wever',	
        beers: [
            'Rothaus Tanne Zapfle',
            'Diebels Altbier',
            'Jever Pils',
            'Erdinger Weissbier hell',
            'Becks Pils',
            'Augustiner Helles Lager',
            'Rothaus Tanne Zapfle',
            'Krombacher dunkel',
            'Weihenstephaner Weissbier hell',
            'Bitburger Pilsener',
        ],
        asterisks: [false,false,false,false,false,false,false,true,false,true],
        ratings: toRatings([3,2,2,3,4,4,4,1,1,2]),
        changes: [1,1,1,1,1,1,1,1,1,1],//falset available, asume 1.	
    },
    {
        id: 'Kevin Perret', 
        beers: [
            'Jever Pils',
            'Becks Pils',
            'Weihenstephaner Weissbier hell',
            'Krombacher dunkel',
            'Paulaner Muenchner Helles Lager',
            'Bitburger Pilsener',
            'Rothaus Tanne Zapfle',
            'Diebels Altbier',
            'Erdinger Weissbier hell',
            'Bitburger Pilsener'
        ],
        asterisks: [false,false,false,true,true,false,false,false,false,false],
        ratings: toRatings([2,2,1,2,2,2,3,2,1,1]),
        changes: [1,1,1,1,1,1,1,1,1,1],//falset available, asume 1.	
    },
    {
        id: 'Emile de Cuba',
        beers: [
            'Paulaner Muenchner Helles Lager',
            'Becks Pils',
            'Erdinger Weissbier hell',
            'Krombacher dunkel',
            'Jever Pils',
            'Bitburger Pilsener',
            'Rothaus Tanne Zapfle',
            'Diebels Altbier',
            'Weihenstephaner Weissbier hell',
            'Augustiner Helles Lager'
        ],
        asterisks: [false,false,false,false,true,false,false,false,true,false],
        ratings: toRatings([2,4,3,3,3,2,3,2,1,2]),
        changes: [1,1,1,1,1,1,1,1,1,1],//falset available, asume 1.	
    },
    {
        id: 'Alex Brokke',	
        beers: [
            'Augustiner Helles Lager',
            'Becks Pils',
            'Weihenstephaner Weissbier hell',
            'Krombacher dunkel',
            'Paulaner Muenchner Helles Lager',
            'Jever Pils',
            'Bitburger Pilsener',
            'Diebels Altbier',
            'Erdinger Weissbier hell',
            'Rothaus Tanne Zapfle'
        ],
        asterisks: [true,true,false,false,false,false,false,false,false,false],
        ratings: toRatings([1,2,2,2,3,3,2,3,2,2]),
        changes: [1,1,1,1,1,1,1,1,1,1],//falset available, asume 1.	
    },
    {
        id: 'Tristan Every',	
        beers: [
            'Rothaus Tanne Zapfle',
            'Augustiner Helles Lager',
            'Becks Pils',
            'Weihenstephaner Weissbier hell',
            'Krombacher dunkel',
            'Paulaner Muenchner Helles Lager',
            'Rothaus Tanne Zapfle',
            'Jever Pils',
            'Diebels Altbier',
            'Erdinger Weissbier hell'
        ],
        asterisks: [false,false,false,true,false,false,false,true,false,false],
        ratings: toRatings([1,3,1,1,2,4,3,2,2,4]),
        changes: [1,1,1,1,1,1,1,1,1,1],//falset available, asume 1.	
    },
    {
        id: 'Walter Peña',	
        beers: [
            'Bitburger Pilsener',
            'Becks Pils',
            'Erdinger Weissbier hell',
            'Bubbly	Diebels Altbier',
            'Jever Pils',
            'Augustiner Helles Lager',
            'Krombacher dunkel',
            'Weihenstephaner Weissbier hell',
            'Rothaus Tanne Zapfle',
            'Paulaner Muenchner Helles Lager'
        ],
        asterisks: [true,true,false,false,false,false,false,false,false,false],
        ratings: toRatings([1,2,1,2,3,4,4,4,4,3]),
        changes: [1,1,1,1,1,1,1,1,1,1],//falset available, asume 1.	
    }
];

test('calculateContestantRoundResults()', () => {
    const results = calculateContestantRoundResults(CORRECT_BEERS, CONTESTANT_ANSWERS);
    expect(results[0].totalPoints).toBe(12); //All 10 correct + 2 correct asterisks.
    expect(results[1].totalPoints).toBe(-2); //All 10 incorrect + 2 incorrect asterisks.
    
    expect(results[0].totalTaste).toBe(14);
    expect(results[1].totalTaste).toBe(30); //All low scores converted to warawara-scores (4 - score).

    expect(results[0].totalAsterisks).toBe(2);
    expect(results[0].totalAsterisksSecondHalf).toBe(0);

    expect(results[1].totalAsterisks).toBe(2);
    expect(results[1].totalAsterisksSecondHalf).toBe(2);
});

test('calculateBeerScoreResults()', () => {
    const results = calculateBeerScoreResults(CORRECT_BEERS, CONTESTANT_ANSWERS);
    expect(results[CORRECT_BEERS[0]]).toBe(0);
    expect(results[CORRECT_BEERS[1]]).toBe(1);
    expect(results[CORRECT_BEERS[2]]).toBe(2);
    expect(results[CORRECT_BEERS[3]]).toBe(3);
    expect(results[CORRECT_BEERS[4]]).toBe(4);
    expect(results[CORRECT_BEERS[5]]).toBe(5);
    expect(results[CORRECT_BEERS[6]]).toBe(6);
    expect(results[CORRECT_BEERS[7]]).toBe(7);
    expect(results[CORRECT_BEERS[8]]).toBe(8);
    expect(results[CORRECT_BEERS[9]]).toBe(8);
});

test('createTastingResults()', () => {
    const roundResults = calculateContestantRoundResults(CORRECT_BEERS, CONTESTANT_ANSWERS);
    const beerScoreResults = calculateBeerScoreResults(CORRECT_BEERS, CONTESTANT_ANSWERS);
    const tastingResults = createTastingResults(roundResults, beerScoreResults);
    
    expect(tastingResults.winner).toBe(CONTESTANT_ANSWERS[0].id);
    expect(tastingResults.second).toBe(CONTESTANT_ANSWERS[1].id);
    expect(tastingResults.third).toBe(null);

    expect(tastingResults.beerLovers[0][0]).toBe(CONTESTANT_ANSWERS[0].id);
    expect(tastingResults.beerLovers[1][0]).toBe(CONTESTANT_ANSWERS[1].id);

    expect(tastingResults.beerHaters[0][0]).toBe(CONTESTANT_ANSWERS[1].id);
    expect(tastingResults.beerHaters[1][0]).toBe(CONTESTANT_ANSWERS[0].id);

    expect(tastingResults.bestBeers[0][0]).toBe(CORRECT_BEERS[0]);
    expect(tastingResults.bestBeers[1][0]).toBe(CORRECT_BEERS[1]);
    expect(tastingResults.bestBeers[2][0]).toBe(CORRECT_BEERS[2]);

    expect(tastingResults.worstBeers[0][0]).toBe(CORRECT_BEERS[9]);
    expect(tastingResults.worstBeers[1][0]).toBe(CORRECT_BEERS[8]);
    expect(tastingResults.worstBeers[2][0]).toBe(CORRECT_BEERS[7]);
    
})

test('calculateContestantRoundResults() on BBT Vitrual event', () => {
    const results = calculateContestantRoundResults(WSC_VIRTUAL_BBT_CORRECT_BEERS, WSC_VIRTUAL_BBT_ANSWERS);
    
    const rankedPoints = rankedPointsSorting(results);
    
    expect(rankedPoints[0].totalPoints).toBe(10);
    expect(rankedPoints[0].totalAsterisks).toBe(1);
    expect(rankedPoints[0].totalAsterisksSecondHalf).toBe(0);
    expect(rankedPoints[0].totalTaste).toBe(28);

    expect(rankedPoints[1].totalPoints).toBe(8);
    expect(rankedPoints[1].totalAsterisks).toBe(2);
    expect(rankedPoints[1].totalAsterisksSecondHalf).toBe(0);
    expect(rankedPoints[1].totalTaste).toBe(18);

    expect(rankedPoints[2].totalPoints).toBe(8);
    expect(rankedPoints[2].totalAsterisks).toBe(2);
    expect(rankedPoints[2].totalAsterisksSecondHalf).toBe(0);
    expect(rankedPoints[2].totalTaste).toBe(22);

});


test('createTastingResults() on BBT Vitrual event', () => {
    const roundResults = calculateContestantRoundResults(WSC_VIRTUAL_BBT_CORRECT_BEERS, WSC_VIRTUAL_BBT_ANSWERS);
    const beerScoreResults = calculateBeerScoreResults(CORRECT_BEERS, CONTESTANT_ANSWERS);
    const tastingResults = createTastingResults(roundResults, beerScoreResults);

    console.log(tastingResults);

});