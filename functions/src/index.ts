import { max } from 'date-fns';
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
    const contestantRoundResults = contestantAnswers?.map( contestantAnswers => {
        return contestantAnswers?.beers.map( (roundAnswer, roundIndex) => {
            const correctBeer = correctBeers[roundIndex];
            const asterisked = contestantAnswers?.asterisks[roundIndex];
            const ratings = contestantAnswers?.ratings[roundIndex];
            const changes = contestantAnswers?.changes[roundIndex];
            const correct = (roundAnswer === correctBeer);
            return {
                index: roundIndex,
                selectedBeer: roundAnswer,
                correctBeer: correctBeer,
                correct: correct,
                tasteScore: Math.max(0, (4 - ratings)),
                asterisked: asterisked,
                points: (correct?1:0) + ((correct && asterisked)?1:0),
                changesMade: changes,
            } as RoundResult;
        })
    });


    
    functions.logger.debug(`eventID = ${eventID}`);
    const results = {
        beerSelection: ['', '', ''],
        tasteScore: ['', '', ''],
        beerLover: '',
        beerHater: '',
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    }
    await admin.firestore().collection('results').doc(eventID).set(results);

    return results;
});
