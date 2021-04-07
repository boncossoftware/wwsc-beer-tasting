import firebase from "firebase/app";
import "firebase/firestore";

export const eventFromDoc = (doc) => {
    return {
        id: doc?.id,
        owner: doc?.data().owner,
        name: doc?.data().name,
        venue: doc?.data().venue,
        date: doc?.data().date?.toDate(),
        price: doc?.data().price,
        related: doc?.data().related,
        bartender: doc?.data().bartender,
        tasters: doc?.data().tasters,
        ownerAddedAsTaster: doc?.data().ownerAddedAsTaster,
        beers: doc?.data().beers,
        asterisksAllowed: doc?.data().asterisksAllowed,
        editingAllowed: doc?.data().editingAllowed,
        rounds: doc?.data().rounds,
    }
}

export const eventToDocData = (event) => {
    return {
        name: event?.name || null,
        owner: event?.owner || null,
        venue: event?.venue || null,
        date: event?.date ? firebase.firestore.Timestamp.fromDate(event.date) : null,
        price: event?.price || null,
        related: event?.related || null,
        bartender: event?.bartender || null,
        tasters: event?.tasters || null,
        ownerAddedAsTaster: Boolean(event?.ownerAddedAsTaster),
        beers: event?.beers || null,
        asterisksAllowed: event?.asterisksAllowed || null,
        editingAllowed: Boolean(event?.editingAllowed),
        rounds: event?.rounds || null,
    }   
}

export const propsForEvent = (userUID, userEmail, event) => {
    const tasters = Array.from( new Set([
        ...(event?.tasters || []),
    ].filter( t => t !== userEmail )));

    const related = Array.from( new Set([
        ...(event?.bartender ? [event?.bartender] : []),
        ...(event?.related || []),
        ...(event?.tasters || []),
    ].filter( r => r !== userEmail )));
    related.push(userEmail);

    return {
        editingAllowed: false, //Default (can be overritten)
        rounds: 10,
        asterisksAllowed: 2, //Default (can be overritten)
        ...event,
        owner: userUID, //Set the user as the owner.
        related,
        tasters,
    };
}