import firebase from "store/firebase";
import "firebase/auth";
import "firebase/firestore";
import { AnyAction, Dispatch } from "redux";
import { RootState } from "store/reducer";
import { TastingAnswer } from "./reducer";
import { answerFromDoc, answerToDocData } from "./utils";

export const ACTION_EVENT_ANSWERS_UPDATING = 'event_answers/updating';
export const ACTION_EVENT_ANSWERS_UPDATED = 'event_answers/updated';
export const ACTION_EVENT_ANSWERS_UPDATE_ERROR = 'event_answers/update_error';

export default function update(id: string, answer: TastingAnswer) {
    return async (dispatch: Dispatch<AnyAction>, getState: () => RootState) => {
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