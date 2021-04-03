import firebase from "firebase/app";
import "firebase/firestore";
import { eventFromDoc } from "./utils";

export const EVENT_MODIFIED_EVENT = 'event-modified';
export const ACTION_EVENTS_LISTEN_CHANGE = 'events/listen_change';

//Subscribe to event changes to listen for allow edit from owner.
var subscribe;
if (!subscribe) {
    subscribe = firebase.firestore().collection('events').onSnapshot( (snapshot) => {
        snapshot.docChanges().forEach( change => {
            if (change.type !== 'modified') return;
            
            const eventData = eventFromDoc(change.doc);
            const windowEvent = new CustomEvent(EVENT_MODIFIED_EVENT, { detail: eventData });
            window.dispatchEvent(windowEvent)
        });
    });
}


export default function listenChange(event) {
    return async (dispatch) => {
        dispatch({ type: ACTION_EVENTS_LISTEN_CHANGE, payload: event});
    }
}