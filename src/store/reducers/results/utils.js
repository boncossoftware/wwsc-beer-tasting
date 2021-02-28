import firebase from "firebase/app";
import "firebase/firestore";

export const resultsFromDoc = (doc, eventID) => {
    return {
        id: eventID,
        beerSelection: doc?.data()?.beerSelection,
        tasteScore: doc?.data()?.tasteScore,
        beerLover: doc?.data()?.beerLover,
        beerHater: doc?.data()?.beerHater,
        lastUpdated: doc?.data()?.lastUpdated?.toDate(),
    }
}

export const resultsToDocData = (results) => {
    return {
        beerSelection: results?.beerSelection,
        tasteScore: results?.tasteScore,
        beerLover: results?.beerLover,
        beerHater: results?.beerHater,
        lastUpdated: results?.lastUpdated ? firebase.firestore.Timestamp.fromDate(results?.lastUpdated) : null,
    }   
}