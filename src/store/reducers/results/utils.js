export const resultsFromDoc = (doc, eventID) => {
    return {
        id: eventID,
        beerSelection: doc?.data()?.beerSelection,
        tasteScrore: doc?.data()?.tasteScrore,
        beerLover: doc?.data()?.beerLover,
        beerHater: doc?.data()?.beerHater,
        lastUpdated: doc?.data()?.lastUpdated,
    }
}

export const resultsToDocData = (results) => {
    return {
        beerSelection: results?.beerSelection,
        tasteScrore: results?.tasteScrore,
        beerLover: results?.beerLover,
        beerHater: results?.beerHater,
        lastUpdated: results?.lastUpdated,
    }   
}