import { DocumentSnapshot } from 'store/firebase';
import { Result } from "./reducer";

export const resultsFromDoc = (doc: DocumentSnapshot): Result => {
    return {
        id: doc.id,
        beerScoreResults: doc?.data()?.beerScoreResults,
        roundResults: doc?.data()?.roundResults,
        lastUpdated: doc?.data()?.lastUpdated?.toDate(),
    }
}