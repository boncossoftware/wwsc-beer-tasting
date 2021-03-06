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
        ...(answer.beers ? {beers: answer.beers} : {}),
        ...(answer.asterisks ? {asterisks: answer.asterisks} : {}),
        ...(answer.ratings ? {ratings: answer.ratings} : {}),
        ...(answer.changes ? {changes: answer.changes} : {}),
    }   
}