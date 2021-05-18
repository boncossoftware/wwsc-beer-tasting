import firebase from 'store/firebase';
import "firebase/firestore";

import { eventFromDoc } from "./utils";
import { AnyAction, Dispatch } from "redux";

export const ACTION_EVENTS_ITEM_LOADING = 'events/load_item_loading';
export const ACTION_EVENTS_ITEM_LOAD = 'events/load_item';
export const ACTION_EVENTS_ITEM_LOAD_ERROR = 'events/load_item_error';

export default function loadItem(id: string) {
    return async (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: ACTION_EVENTS_ITEM_LOADING, payload: {id, loading: true }});
        try {
            const doc = await firebase.firestore().collection('events').doc(id).get();
            const item = eventFromDoc(doc);
            dispatch({ type: ACTION_EVENTS_ITEM_LOAD, payload: item});
        }
        catch (error) {
            dispatch({ type: ACTION_EVENTS_ITEM_LOAD_ERROR, payload: {id, error }});
        }
        dispatch({ type: ACTION_EVENTS_ITEM_LOADING, payload: {id, loading: false }});
    }
}