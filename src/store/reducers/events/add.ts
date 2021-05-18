import firebase, { getCurrentUserInfo } from 'store/firebase';
import "firebase/auth";
import "firebase/firestore";

import { TastingEvent } from "./reducer";
import { AnyAction, Dispatch } from "redux";
import { eventFromDoc, eventToDocData, propsForEvent } from "./utils";

export const ACTION_EVENTS_ADDING = 'events/adding';
export const ACTION_EVENTS_ADD = 'events/add';
export const ACTION_EVENTS_ADD_ERROR = 'events/add_error';

export default function add(event: TastingEvent) {
    return async (dispatch: Dispatch<AnyAction>) => {

        dispatch({ type: ACTION_EVENTS_ADDING, payload: true});
        try {
            const {uid, email} = getCurrentUserInfo(); 
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