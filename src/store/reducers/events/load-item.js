import firebase from "firebase/app";
import "firebase/firestore";
import { eventFromDoc } from "./utils";

export const ACTION_EVENTS_ITEM_LOADING = 'events/loading';
export const ACTION_EVENTS_LOAD_ITEM = 'events/load_item';
export const ACTION_EVENTS_LOAD_ITEM_ERROR = 'events/load_item_error';

export default function loadItem(id) {
    return async (dispatch) => {
        dispatch({ type: ACTION_EVENTS_ITEM_LOADING, payload: {id, loading: true }});
        try {
            const doc = await firebase.firestore().collection('events').doc(id).get();
            const item = eventFromDoc(doc);
            dispatch({ type: ACTION_EVENTS_LOAD_ITEM, payload: item});
        }
        catch (error) {
            dispatch({ type: ACTION_EVENTS_LOAD_ITEM_ERROR, payload: {id, error }});
        }
        dispatch({ type: ACTION_EVENTS_ITEM_LOADING, payload: {id, loading: false }});
    }
}