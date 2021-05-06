import firebase from "firebase/app";
import { Result } from "./reducer";

export const resultsFromDoc = (doc: firebase.firestore.DocumentSnapshot): Result => {
    return {
        id: doc.id,
        beerSelection: doc?.data()?.beerSelection,
        tasteScore: doc?.data()?.tasteScore,
        beerLover: doc?.data()?.beerLover,
        beerHater: doc?.data()?.beerHater,
        lastUpdated: doc?.data()?.lastUpdated?.toDate(),
    }
}

export const resultsToDocData = (results: Result): any => {
    return {
        beerSelection: results?.beerSelection,
        tasteScore: results?.tasteScore,
        beerLover: results?.beerLover,
        beerHater: results?.beerHater,
        lastUpdated: results?.lastUpdated ? firebase.firestore.Timestamp.fromDate(results?.lastUpdated) : null,
    }   
}