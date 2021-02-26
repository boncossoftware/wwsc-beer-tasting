export const answerFromDoc = (doc, eventID) => {
    return {
        id: eventID,
        beers: doc.data().beers,
        asterisks: doc.data().asterisks,
        ratings: doc.data().ratings,
        changes: doc.data().changes
    }
}

export const answerToDocData = (answer) => {
    return {
        beers: answer.beers,
        asterisks: answer.asterisks,
        ratings: answer.ratings,
        changes: answer.changes
    }   
}