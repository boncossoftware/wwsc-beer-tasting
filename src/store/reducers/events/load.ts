import firebase from 'store/firebase';
import "firebase/firestore";

import { subscribe } from "./listen-change";
import { eventFromDoc } from "./utils";
import { AnyAction, Dispatch } from "redux";
import { RootState, StoreError } from "store/reducer";

export const ACTION_EVENTS_LOADING = 'events/loading';
export const ACTION_EVENTS_LOAD = 'events/load';
export const ACTION_EVENTS_LOAD_ERROR = 'events/load_error';

export default function load() {
    return async (dispatch: Dispatch<AnyAction>, getState: (() => RootState), ...p:any[]) => {
        dispatch({ type: ACTION_EVENTS_LOADING, payload: true});
        try {
            const { auth } = getState();
            if (!auth.user?.email) {
                throw new StoreError('No current user.')
            }
            
            const relatedEventsColRef = (
                firebase.firestore()
                .collection('events')
                .where('related', 'array-contains', auth.user?.email)
                .orderBy('date', 'desc')
            );
            const result = await relatedEventsColRef.get();
            const items = result.docs.map( eventFromDoc );
            dispatch({ type: ACTION_EVENTS_LOAD, payload: items});
            subscribe(auth.user?.email); //Listen for changes for this user.
        }
        catch (error) {
            dispatch({ type: ACTION_EVENTS_LOAD_ERROR, payload: error});
        }
        dispatch({ type: ACTION_EVENTS_LOADING, payload: false});
    }
}