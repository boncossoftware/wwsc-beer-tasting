import firebase, { DocumentSnapshot } from "store/firebase";
import "firebase/firestore";

import { AnyAction, Dispatch } from "redux";
import { resultsFromDoc } from "./utils";
import { Result } from "./reducer";

export const RESULTS_MODIFIED_EVENT = "results-modified";
export const ACTION_RESULTS_LISTEN_CHANGE = "results/listen_change";

//Subscribe to event changes to listen for allow edit from owner.
let _unsubscribe: (() => void) | undefined;

export function subscribe(id: string) {
  unsubscribe();

  const itemRef = firebase.firestore().collection("results").doc(id);
  _unsubscribe = itemRef.onSnapshot((snapshot: DocumentSnapshot) => {
    const item = resultsFromDoc(snapshot);
    const windowEvent = new CustomEvent(RESULTS_MODIFIED_EVENT, {
      detail: item,
    });
    window.dispatchEvent(windowEvent);
  }, console.log);
}

export function unsubscribe() {
  _unsubscribe && _unsubscribe();
  _unsubscribe = undefined;
}

export default function listenChange(event: Result) {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: ACTION_RESULTS_LISTEN_CHANGE, payload: event });
  };
}
