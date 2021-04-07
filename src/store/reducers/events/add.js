import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { eventFromDoc, eventToDocData, propsForEvent } from "./utils";

export const ACTION_EVENTS_ADDING = 'events/adding';
export const ACTION_EVENTS_ADD = 'events/add';
export const ACTION_EVENTS_ADD_ERROR = 'events/add_error';

export default function add(event) {
    return async (dispatch) => {

        dispatch({ type: ACTION_EVENTS_ADDING, payload: true});
        try {
            const uid = firebase.auth().currentUser.uid; 
            const email = firebase.auth().currentUser.email; 
            const props = propsForEvent(uid, email, event); //Add the owner as related.
            const docData = eventToDocData(props);
            const docRef = await firebase.firestore().collection('events').add(docData);
            const doc = await docRef.get();
            event = eventFromDoc(doc);
            dispatch({ type: ACTION_EVENTS_ADD, payload: event});
        }
        catch (error) {
            dispatch({ type: ACTION_EVENTS_ADD_ERROR, payload: error});
        }
        dispatch({ type: ACTION_EVENTS_ADDING, payload: false});
    }
}