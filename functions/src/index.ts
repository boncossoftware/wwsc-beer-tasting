import * as admin from 'firebase-admin';
import * as functions from "firebase-functions";

admin.initializeApp();

const onCall = functions.https.onCall;

export interface BarTenderAnswers {   
    id: string, 
    beers: string[]
}

export interface ContestantAnswers extends BarTenderAnswers {
    asterisks: (boolean|null)[],
    ratings: (number|null)[],
    changes: (number|null)[],
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
    totalChanges: number,
    roundResults: RoundResult[],
    beerScores: {[id:string]: number};
}

interface TastingResults {
    winner: string
    second: string
    third: string
    beerLovers: [string, number][]
    beerHaters: [string, number][]
    bestBeers: [string, number][]
    worstBeers: [string, number][]
    results: ResultSummary[]
}

interface ResultsError {
    error: {
        message: string,
        code: number
    }
}

type ContestantRoundResults = ResultSummary[];
type BeerScoreResults = {[id:string]: number};


const docToObject = (doc: admin.firestore.QueryDocumentSnapshot) => ({id: doc.id, ...(doc.data() || {}) }) as ContestantAnswers;

export const calculateResults = onCall(async (data, context) => {
    //Get all answers.
    const eventID = data;
    
    try {
        const [correctBeers,contestantAnswers] = await Promise.all([
            fetchCorrectBeers(eventID),
            fetchContestantAnswers(eventID)
        ]);
        
        const contestantRoundResults = calculateContestantRoundResults(correctBeers, contestantAnswers)
        functions.logger.debug(`results calculated (${eventID})`);
        
        const beerScoreResults = calculateBeerScoreResults(correctBeers, contestantAnswers);
        functions.logger.debug(`beer score totals calculated (${eventID})`);
    
        const tastingResults = createTastingResults(contestantRoundResults, beerScoreResults);
        functions.logger.debug(`tasting results calculated (${eventID})`);
        
        await admin.firestore().collection('results').doc(eventID).set(tastingResults);
        functions.logger.debug(`tasting saved (${eventID})`);
    
        return tastingResults;

    } catch (error) {
        const message = (error as ResultsError).error.message;
        const code = (error as ResultsError).error.code;
        functions.logger.error(`Error: ${message} (${code})`);
        return error;
    }
});

export const fetchCorrectBeers = async (eventID: string): Promise<string[]> => {
    const eventRef = admin.firestore().collection('events').doc(eventID);
    const [eventDoc, bartenderUID] = await Promise.all([
        eventRef.get(),
        fetchEventBarTenderUID(eventID)
    ]);
    
    //Make sure the event exists.
    if (!eventDoc.exists) {
        throw {error: {message: `No event found with ID (${eventID}).`, code: 1500}} as ResultsError;
    }
    
    //Check if we have bartender answers.
    const answersDoc = await eventRef.collection('answers').doc(bartenderUID).get();
    if (!answersDoc.exists) {
        throw {error: {message: `No answers found for bartender.`, code: 1500}} as ResultsError;
    }
    functions.logger.debug(`bartender has answers (${bartenderUID})`);

    const bartenderAnswers = {id: answersDoc.id, beers: (answersDoc.data()?.beers || [])} as BarTenderAnswers;

    //Make sure every beer is set.
    const allBeersSet = bartenderAnswers?.beers?.map( b => b?.length > 0 )?.every( set => set );
    if (!allBeersSet) {
        throw {error: {message: `Bar tender has not set all beers yet.`, code: 1500}} as ResultsError;
    }
    functions.logger.debug(`bartender has all beers set (${bartenderUID})`);
    
    return bartenderAnswers?.beers || [];
}

export const fetchContestantAnswers = async (eventID: string): Promise<ContestantAnswers[]> => {
    const eventRef = admin.firestore().collection('events').doc(eventID);
    const [answersQuery, bartenderUID] = await Promise.all([
        eventRef.collection('answers').get(),
        fetchEventBarTenderUID(eventID)
    ]);

    const answers: ContestantAnswers[] = (answersQuery?.docs?.map( docToObject ) || []);
    return answers.filter( a => a.id !== bartenderUID);
}

export const fetchEventBarTenderUID = async (eventID: string): Promise<string> => {
    const eventRef = admin.firestore().collection('events').doc(eventID);
    const eventDoc = await eventRef.get();

     //Make sure the bartender is set.
     const event = (eventDoc?.data() || {});
     if (!event?.bartender) {
         throw {error: {message: `Event does not have a bartender (${eventID})`, code: 1500}} as ResultsError;
     }
     
     //Find the bartender user account to get the uid.
     let bartenderUser: admin.auth.UserRecord;
     try {
         bartenderUser = await admin.auth().getUserByEmail(event?.bartender);
     }
     catch (error) {
         throw {error: {message: `Error fetching bar tender account. No account found or email incorrect. (${event?.bartender})`, code: 1500}} as ResultsError;
     }
    return bartenderUser.uid;
}

export const calculateContestantRoundResults = (correctBeers: string[], contestantAnswers: ContestantAnswers[]): ContestantRoundResults => {
    const rounds = correctBeers.length;
    return (contestantAnswers||[]).map( 
        contestantAnswers => {
            const summary: ResultSummary = {
                totalPoints: 0,
                totalTaste: 0,
                totalAsterisks: 0,
                totalAsterisksSecondHalf: 0,
                totalChanges: 0,
                roundResults:[],
                userUID: contestantAnswers.id,
                beerScores: {}
            };

            summary.roundResults = contestantAnswers?.beers.map( (roundAnswer, roundIndex) => {
                const correctBeer = correctBeers[roundIndex];
                const asterisked = contestantAnswers?.asterisks[roundIndex] || false;
                const tasteScore = Math.max(0, (4 - (contestantAnswers?.ratings[roundIndex]||0) ));
                const changes = contestantAnswers?.changes[roundIndex];
                const correct = (roundAnswer === correctBeer);
                const points = (correct?1:0) + ((correct && asterisked)?1:0) + ((!correct && asterisked)?-1:0);

                const isSecondHalf = roundIndex >= (rounds / 2);
                summary.totalPoints += points;
                summary.totalTaste += tasteScore;
                summary.totalAsterisks += asterisked?1:0;
                summary.totalAsterisksSecondHalf += (asterisked && isSecondHalf)?1:0;
                summary.totalChanges += changes||0;
                summary.beerScores[correctBeer] = (summary.beerScores[correctBeer]||0) + tasteScore;

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
    ) as ContestantRoundResults;
}

export const calculateBeerScoreResults = (correctBeers: string[], contestantAnswers: ContestantAnswers[]): BeerScoreResults => {
    return (correctBeers||[]).reduce( (results, beer, roundIndex) => {
        const toTasteScore = (rating:number) => Math.max(0, 4 - rating);
        const roundTotalScore = contestantAnswers?.reduce( (t, a) => t + toTasteScore((a.ratings[roundIndex]||0)), 0);
        const beerCurrentScore = results[beer] || 0;
        results[beer] = beerCurrentScore + roundTotalScore;
        return results;
    }, {} as BeerScoreResults);
}

export const rankedPointsSorting = (contestantRoundResults: ContestantRoundResults=[]) => 
    contestantRoundResults.slice().sort( (r1: ResultSummary, r2: ResultSummary): number => {
        if(r2.totalPoints !== r1.totalPoints) {
            //Base on points if not tied.
            return r2.totalPoints - r1.totalPoints;
        }
        else {
            //If points are tied than base on total asterisks (less wins)
            if (r2.totalAsterisks !== r1.totalAsterisks) {
                return r1.totalAsterisksSecondHalf - r2.totalAsterisksSecondHalf;
            }
            else {
                //If points and total asterisks are tied than base on total asterisks second half (less wins).
                if (r2.totalAsterisksSecondHalf !== r1.totalAsterisksSecondHalf) {
                    return r1.totalAsterisksSecondHalf - r2.totalAsterisksSecondHalf;
                }
                else {
                    //If points and total asterisks (second half) are tied than base on total changes (less wins).
                    if (r2.totalChanges !== r1.totalChanges) {
                        return r1.totalChanges - r2.totalChanges
                    }
                    else {
                        //If all else fails thant base on total warawara taste score (less wins).
                        return r1.totalTaste - r2.totalTaste;
                    }
                }
            }
        }
    });

export const rankedTastScoreSorting = (contestantRoundResults: ContestantRoundResults=[]): [string, number][] => 
    contestantRoundResults.slice().sort( (r1: ResultSummary, r2: ResultSummary) => {
        return r1.totalTaste - r2.totalTaste
    }).map( r => 
        [r.userUID, r.totalTaste]
    );

export const rankedBeerTasteSorting = (beerScoreResults: BeerScoreResults={}): [string, number][] => 
    Object.keys(beerScoreResults)
        .sort( (k1,k2) => beerScoreResults[k1] - beerScoreResults[k2] )
        .map( k => [k, beerScoreResults[k]] );


export const createTastingResults = (contestantRoundResults: ContestantRoundResults, beerScoreResults: BeerScoreResults): TastingResults => {
    const rankedPoints = rankedPointsSorting(contestantRoundResults);
    const rankedTaste = rankedTastScoreSorting(contestantRoundResults);
    const rankedBeerTaste = rankedBeerTasteSorting(beerScoreResults); 
    return {
        winner: rankedPoints[0]?.userUID || 'None',
        second: rankedPoints[1]?.userUID || 'None',
        third: rankedPoints[3]?.userUID || null,
        beerLovers: rankedTaste?.slice(0, 3),
        beerHaters: rankedTaste?.reverse().slice(0, 3),
        bestBeers: rankedBeerTaste.slice(0, 3),
        worstBeers: rankedBeerTaste.reverse().slice(0, 3),
        results: rankedPoints
    } as TastingResults;
}