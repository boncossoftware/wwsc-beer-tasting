import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { eventFromDoc, eventToDocData, propsForEvent } from "./utils";
import { TastingEvent } from "./reducer";
import { Dispatch, AnyAction } from "redux";
import { StoreError } from "store/reducer";
import { getCurrentUserInfo } from "store/firebase";

export const ACTION_EVENTS_UPDATING = 'events/adding';
export const ACTION_EVENTS_UPDATE = 'events/update';
export const ACTION_EVENTS_UPDATE_ERROR = 'events/update_error';

export default function update(event: TastingEvent) {
    return async (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: ACTION_EVENTS_UPDATING, payload: true});
        try {
            const {uid, email} = getCurrentUserInfo(); 
            if (!event?.id) {
                throw new StoreError('Event does not have an ID');
            }
            const props = propsForEvent(uid, email, event); //Add the owner as related.
            const docRef = firebase.firestore().collection('events').doc(event.id);
            const resultsRef = firebase.firestore().collection('results').doc(event.id);
            await Promise.all([
                docRef.update(eventToDocData(props)),
                //Delete all answers.
                docRef.collection('answers').get().then( snaps => 
                    Promise.all(snaps.docs.map( snap => snap.ref.delete() ))
                ),
                //Delete all results.
                resultsRef.delete(),
            ]);
            const doc = await docRef.get();
            event = eventFromDoc(doc);
            dispatch({ type: ACTION_EVENTS_UPDATE, payload: event});
        }
        catch (error) {
            dispatch({ type: ACTION_EVENTS_UPDATE_ERROR, payload: error});
        }
        dispatch({ type: ACTION_EVENTS_UPDATING, payload: false});
    }
}