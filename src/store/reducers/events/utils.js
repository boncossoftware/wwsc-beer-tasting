import firebase from "firebase/app";
import "firebase/firestore";

export const eventFromDoc = (doc) => {
    return {
        id: doc?.id,
        owner: doc?.data().owner,
        name: doc?.data().name,
        venue: doc?.data().venue,
        date: doc?.data().date?.toDate(),
        related: doc?.data().related,
        bartender: doc?.data().bartender,
        tasters: doc?.data().tasters,
        ownerAddedAsTaster: doc?.data().ownerAddedAsTaster,
        beers: doc?.data().beers,
        asterisksAllowed: doc?.data().asterisksAllowed,
        editingAllowed: doc?.data().editingAllowed,
    }
}

export const eventToDocData = (event) => {
    return {
        name: event?.name,
        owner: event?.owner,
        venue: event?.venue,
        date: event?.date ? firebase.firestore.Timestamp.fromDate(event.date) : null,
        related: event?.related,
        bartender: event?.bartender,
        tasters: event?.tasters,
        ownerAddedAsTaster: event?.ownerAddedAsTaster,
        beers: event?.beers,
        asterisksAllowed: event?.asterisksAllowed,
        editingAllowed: event?.editingAllowed,
    }   
}