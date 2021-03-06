import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { answerFromDoc, answerToDocData } from "./utils";

export const ACTION_EVENT_ANSWERS_UPDATING = 'event_answers/updating';
export const ACTION_EVENT_ANSWERS_UPDATED = 'event_answers/updated';
export const ACTION_EVENT_ANSWERS_UPDATE_ERROR = 'event_answers/update_error';

export default function update(id, answer) {
    return async (dispatch, getState) => {
        dispatch({ type: ACTION_EVENT_ANSWERS_UPDATING, payload: true});
        try {
            const { auth } = getState();
            const eventDocRef = firebase.firestore().collection('events').doc(id);
            const itemRef = eventDocRef.collection('answers').doc(auth?.user?.uid);
            
            const docData = answerToDocData(answer);
            itemRef.update(docData);
            
            const doc = await itemRef.get();
            answer = answerFromDoc(doc);
            dispatch({ type: ACTION_EVENT_ANSWERS_UPDATED, payload: answer});
        }
        catch (error) {
            dispatch({ type: ACTION_EVENT_ANSWERS_UPDATE_ERROR, payload: error});
        }
        dispatch({ type: ACTION_EVENT_ANSWERS_UPDATING, payload: false});
    }
}