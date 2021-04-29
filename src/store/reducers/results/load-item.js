import firebase from "../../firebase";
import "firebase/firestore";
import { resultsFromDoc } from "./utils";

export const ACTION_EVENT_RESULTS_ITEM_LOADING = 'event_results/loading';
export const ACTION_EVENT_RESULTS_LOAD_ITEM = 'event_results/load_item';
export const ACTION_EVENT_RESULTS_LOAD_ITEM_ERROR = 'event_results/load_item_error';

export default function loadItem(id) {
    return async (dispatch) => {
        dispatch({ type: ACTION_EVENT_RESULTS_ITEM_LOADING, payload: {id, loading: true }});
        try {
            const itemRef = firebase.firestore().collection('results').doc(id);
            const doc = await itemRef.get();
            if (!doc.exists) {
                doc.data = () => ({}); //No results.
            }
            const item = resultsFromDoc(doc, id);
            dispatch({ type: ACTION_EVENT_RESULTS_LOAD_ITEM, payload: item});
        }
        catch (error) {
            dispatch({ type: ACTION_EVENT_RESULTS_LOAD_ITEM_ERROR, payload: {id, error }});
        }
        dispatch({ type: ACTION_EVENT_RESULTS_ITEM_LOADING, payload: {id, loading: false }});
    }
}