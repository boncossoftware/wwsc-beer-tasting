import firebase from "firebase/app";

import { TastingAnswer } from "./reducer"

export const answerFromDoc = (doc: firebase.firestore.DocumentSnapshot) => {
    return {
        id: doc.id,
        beers: doc.data()?.beers,
        asterisks: doc.data()?.asterisks,
        ratings: doc.data()?.ratings,
        changes: doc.data()?.changes
    }
}

export const answerToDocData = (answer: TastingAnswer) => {
    return {
        ...(answer.beers ? {beers: answer.beers} : {}),
        ...(answer.asterisks ? {asterisks: answer.asterisks} : {}),
        ...(answer.ratings ? {ratings: answer.ratings} : {}),
        ...(answer.changes ? {changes: answer.changes} : {}),
    }   
}