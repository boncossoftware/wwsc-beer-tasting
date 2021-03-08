import * as admin from 'firebase-admin';
import * as functions from "firebase-functions";

admin.initializeApp();

const onCall = functions.https.onCall;

interface BarTenderAnswers {   
    id: string, 
    beers: [string]
}

interface ContestantAnswers extends BarTenderAnswers {
    asterisks: boolean[],
    ratings: number[],
    changes: number[],
}   

interface RoundResult {
    index: number,
    selectedBeer: string,
    correctBeer: string,
    correct: boolean,
    tasteScore: number,
    asterisked: boolean,
    points: number,
    changesMade: number,
}

interface ResultSummary {
    userUID: string,
    totalPoints: number,
    totalTaste: number,
    totalAsterisks: number,
    totalAsterisksSecondHalf: number,
    roundResults: RoundResult[],
    beerScores: {[id:string]: number};
}

interface TastingResults {
    winner: string,
    second: string,
    third: string,
    beerLovers: [string, number][]
    beerHaters: [string, number][]
    bestBeers: [string, number][]
    worstBeers: [string, number][]
    results: ResultSummary[]
}

export const calculateResults = onCall(async (data, context) => {
    //Get all answers.
    const eventID = data;
    const eventRef = admin.firestore().collection('events').doc(eventID);

    //Get all of the event and answer data. 
    const [
        eventDoc,
        answersQuery,
    ] = await Promise.all([
        eventRef.get(),
        eventRef.collection('answers').get(),
    ]);
    
    //Make sure the event exists.
    if (!eventDoc.exists) {
        throw new Error(`No event found with ID "${eventID}".`);
    }
    
    //Make sure the bartender is set.
    const event = (eventDoc?.data() || {});
    if (!event?.bartender) {
        throw new Error(`No event found with ID "${eventID}".`);
    }
    
    //Find the bartender user account to get the uid.
    let bartenderUser: admin.auth.UserRecord;
    try {
        bartenderUser = await admin.auth().getUserByEmail(event?.bartender);
    }
    catch (error) {
        throw new Error(`Error fetching bar tender account. No account found or email incorrect.`);
    }

    const answers = (answersQuery?.docs?.map( d => ({id:d.id, ...(d.data() || {}) }) ) || []);

    //Check if we have bartender answers.
    const bartenderAnswers = answers.find( a => a.id === bartenderUser?.uid ) as BarTenderAnswers;
    if (!bartenderAnswers) {
        throw new Error(`No answers found for bartender.`);
    }
    //Make sure every beer is set.
    const allBeersSet = bartenderAnswers?.beers?.map( b => b?.length > 0 )?.every( set => set );
    if (!allBeersSet) {
        throw new Error(`Bar tender has not set all beers yet.`);
    }
    
    const correctBeers = bartenderAnswers?.beers || [];
    const contestantAnswers = (answers?.filter( a => a.id !== bartenderUser?.uid )) as ContestantAnswers[];
    const contestantRoundResults = contestantAnswers?.map( 
        contestantAnswers => {
            const summary: ResultSummary = {
                totalPoints: 0,
                totalTaste: 0,
                totalAsterisks: 0,
                totalAsterisksSecondHalf: 0,
                roundResults:[],
                userUID: contestantAnswers.id,
                beerScores: {}
            };

            summary.roundResults = contestantAnswers?.beers.map( (roundAnswer, roundIndex) => {
                const correctBeer = correctBeers[roundIndex];
                const asterisked = contestantAnswers?.asterisks[roundIndex];
                const tasteScore = Math.max(0, (4 - contestantAnswers?.ratings[roundIndex]));
                const changes = contestantAnswers?.changes[roundIndex];
                const correct = (roundAnswer === correctBeer);
                const points = (correct?1:0) + ((correct && asterisked)?1:0);

                const isSecondHalf = roundIndex >= (event?.rounds / 2);
                summary.totalPoints += points;
                summary.totalTaste += tasteScore;
                summary.totalAsterisks += asterisked?1:0;
                summary.totalAsterisksSecondHalf += (asterisked && isSecondHalf)?1:0;
                summary.beerScores[correctBeer] += tasteScore;

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
    );

    const beers = contestantRoundResults.reduce( (b,r) => {
        Object.keys(r.beerScores).forEach( beer => {
            b[beer] += r.beerScores[beer]}
        );
        return b;
    }, {} as {[id:string]: number});

    const rankedPoints = contestantRoundResults.sort( (r1,r2) => r1.totalPoints - r2.totalPoints);
    const rankedTaste = contestantRoundResults.sort( (r1,r2) => r2.totalTaste - r1.totalTaste);
    const rankedBeerTaste: [string, number][] = Object.keys(beers).sort( (k1,k2) => beers[k1] - beers[k2] ).map( k => [k, beers[k]] );
    const tastingResults: TastingResults = {
        winner: rankedPoints[0]?.userUID || 'None',
        second: rankedPoints[1]?.userUID || 'None',
        third: rankedPoints[3]?.userUID || 'None',
        beerLovers: rankedTaste?.slice(0, 3).map( r => [r.userUID, r.totalTaste]),
        beerHaters: rankedTaste?.reverse().slice(0, 3).map( r => [r.userUID, r.totalTaste]),
        bestBeers: rankedBeerTaste.slice(0, 3),
        worstBeers: rankedBeerTaste.reverse().slice(0, 3),
        results: contestantRoundResults
    } 

    
    functions.logger.debug(`eventID = ${eventID}`);

    await admin.firestore().collection('results').doc(eventID).set(tastingResults);

    return tastingResults;
});
