import { DocumentSnapshot, Timestamp } from 'store/firebase';
import { Result } from "./reducer";

export const resultsFromDoc = (doc: DocumentSnapshot): Result => {
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
        lastUpdated: results?.lastUpdated ? Timestamp.fromDate(results?.lastUpdated) : null,
    }   
}