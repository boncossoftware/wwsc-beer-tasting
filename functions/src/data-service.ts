import * as admin from "firebase-admin";
import { WSC_VIRTUAL_BBT_CORRECT_BEERS, WSC_VIRTUAL_BBT_ANSWERS } from "./model";
import {ContestantAnswers, TastingEvent, TastingResults} from './model';

if (admin.apps.length === 0) {
    admin.initializeApp();

    const eventRef = admin.firestore().collection('events').doc('9BrxyRVWNa3JcOXr8gYj');
    const answersRef = eventRef.collection('answers');
    
    //Insert bar tender info.
    answersRef.doc('bartender@boncos.io').set({
        beers: WSC_VIRTUAL_BBT_CORRECT_BEERS
    });

    //Insert all contestants answers
    const contestantId: string[] = [];
    WSC_VIRTUAL_BBT_ANSWERS.forEach( anwers => {
        contestantId.push(anwers.id);
        answersRef.doc(anwers.id).set(anwers);
    });

    eventRef.update({
        related: [
            ...contestantId,
            'israel@boncos.io'
        ],
        tasters: contestantId,
        beers: WSC_VIRTUAL_BBT_CORRECT_BEERS
    });
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