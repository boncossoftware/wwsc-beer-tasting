import * as admin from "firebase-admin";
import {ContestantAnswers, TastingEvent, TastingResults} from './model';

if (admin.apps.length === 0) {
    admin.initializeApp();
}

export const getTastingEvent = (id: string): Promise<TastingEvent> => {
    const eventRef = admin.firestore().collection('events').doc(id);
    return eventRef.get().then( e => 
        ({id: e.id, ...e.data()} as TastingEvent) 
    );
}

export const getTastingEventAnswers = (id: string): Promise<ContestantAnswers[]> => {
    const eventRef = admin.firestore().collection('events').doc(id);
    return eventRef.collection('answers').get().then( s => 
            s.docs.map( d => ({id: d.id, ...d.data()} as ContestantAnswers) ) 
    );
}

export const setResults = (id: string, results: TastingResults) => {
    //Save the results.
    const resultsRef = admin.firestore().collection("results").doc(id)
    return resultsRef.set(results);
}