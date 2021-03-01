import firebase from "firebase/app";
import "firebase/firestore";
import { answerFromDoc } from "./utils";

export const ACTION_EVENT_ANSWERS_ITEM_LOADING = 'event_answers/loading';
export const ACTION_EVENT_ANSWERS_LOAD_ITEM = 'event_answers/load_item';
export const ACTION_EVENT_ANSWERS_LOAD_ITEM_ERROR = 'event_answers/load_item_error';

export default function loadItem(id) {
    return async (dispatch, getState) => {
        dispatch({ type: ACTION_EVENT_ANSWERS_ITEM_LOADING, payload: {id, loading: true }});
        try {
            const { auth } = getState();
            const eventDocRef = firebase.firestore().collection('events').doc(id);
            const itemRef = eventDocRef.collection('answers').doc(auth?.user?.uid);
            const [doc, event] = await Promise.all([
                itemRef.get(),
                eventDocRef.get()
            ]);
            if (!doc.exists) {
                doc.data = () => ({
                    beers: [],
                    asterisks: [],
                    ratings: [],
                    changes: [],
                    rounds: event?.data().rounds || 0,
                });
                await itemRef.set(doc.data());
            }
            const item = answerFromDoc(doc, id);
            dispatch({ type: ACTION_EVENT_ANSWERS_LOAD_ITEM, payload: item});
        }
        catch (error) {
            dispatch({ type: ACTION_EVENT_ANSWERS_LOAD_ITEM_ERROR, payload: {id, error }});
        }
        dispatch({ type: ACTION_EVENT_ANSWERS_ITEM_LOADING, payload: {id, loading: false }});
    }
}