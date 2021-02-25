import firebase from "firebase/app";
import "firebase/firestore";
import { eventFromDoc } from "./utils";

export const ACTION_EVENTS_LOADING = 'events/loading';
export const ACTION_EVENTS_LOAD = 'events/load';
export const ACTION_EVENTS_LOAD_ERROR = 'events/load_error';

export default function load() {
    return async (dispatch, getState) => {
        dispatch({ type: ACTION_EVENTS_LOADING, payload: true});
        try {
            const { auth } = getState();
            const result = await firebase.firestore().collection('events').where('related', 'array-contains', auth.user.email).get();
            const items = result.docs.map( eventFromDoc );
            dispatch({ type: ACTION_EVENTS_LOAD, payload: items});
        }
        catch (error) {
            dispatch({ type: ACTION_EVENTS_LOAD_ERROR, payload: error});
        }
        dispatch({ type: ACTION_EVENTS_LOADING, payload: false});
    }
}