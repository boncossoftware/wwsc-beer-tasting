import firebase, { DocumentSnapshot } from "store/firebase";
import "firebase/firestore";

import { answerFromDoc } from "./utils";
import { AnyAction, Dispatch } from "redux";
import { TastingAnswer } from "./reducer";

export const ANSWER_MODIFIED_EVENT = "answer-modified";
export const ACTION_ANSWERS_LISTEN_CHANGE = "answers/listen_change";

//Subscribe to event changes to listen for allow edit from owner.
var _unsubscribe: (() => void) | undefined;

export function subscribe(eventId: string, answersId: string) {
  unsubscribe();

  const eventDocRef = firebase.firestore().collection("events").doc(eventId);
  const itemRef = eventDocRef.collection("answers").doc(answersId);
  _unsubscribe = itemRef.onSnapshot((snapshot: DocumentSnapshot) => {
      const answerData = answerFromDoc(snapshot);
      const windowEvent = new CustomEvent(ANSWER_MODIFIED_EVENT, {
        detail: answerData,
      });
      window.dispatchEvent(windowEvent);
  }, console.log);
}

export function unsubscribe() {
  _unsubscribe && _unsubscribe();
  _unsubscribe = undefined;
}

export default function listenChange(event: TastingAnswer) {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: ACTION_ANSWERS_LISTEN_CHANGE, payload: event });
  };
}
