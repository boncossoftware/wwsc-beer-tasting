import firebase from "store/firebase";
import "firebase/firestore";
import { Dispatch, AnyAction } from "redux";
import { resultsFromDoc } from "./utils";
import { subscribe } from "./listen-change";

export const ACTION_EVENT_RESULTS_ITEM_LOADING = "event_results/loading";
export const ACTION_EVENT_RESULTS_LOAD_ITEM = "event_results/load_item";
export const ACTION_EVENT_RESULTS_LOAD_ITEM_ERROR =
  "event_results/load_item_error";

export default function loadItem(id: string) {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch({
      type: ACTION_EVENT_RESULTS_ITEM_LOADING,
      payload: { id, loading: true },
    });
    try {
      const itemRef = firebase.firestore().collection("results").doc(id);
      const doc = await itemRef.get();
      if (!doc.exists) {
        doc.data = () => ({}); //No results.
      }
      const item = resultsFromDoc(doc);
      dispatch({ type: ACTION_EVENT_RESULTS_LOAD_ITEM, payload: item });
      subscribe(id); //Listen for changes for this results.
    } catch (error) {
      dispatch({
        type: ACTION_EVENT_RESULTS_LOAD_ITEM_ERROR,
        payload: { id, error },
      });
    }
    dispatch({
      type: ACTION_EVENT_RESULTS_ITEM_LOADING,
      payload: { id, loading: false },
    });
  };
}
