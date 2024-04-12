import firebase, {
  DocumentSnapshot,
  FieldPath,
  QuerySnapshot,
} from "store/firebase";
import "firebase/firestore";

import { AnyAction, Dispatch } from "redux";
import { User } from "./reducer";
import { userFromDoc } from "./utils";

export const USER_MODIFIED_EVENT = "user-modified";
export const ACTION_USERS_LISTEN_CHANGE = "users/listen_change";

//Subscribe to event changes to listen for allow edit from owner.
let _unsubscribe: (() => void) | undefined;

export function subscribe(emails: (string | null)[]) {
  unsubscribe();
  const validEmails = emails.filter((email) => email) as string[];
  const allUnsubscribes = validEmails.map((email) => {
    const relatedUserRef = firebase.firestore().collection("users").doc(email);
    return relatedUserRef.onSnapshot((snapshot: DocumentSnapshot) => {
      const userData = userFromDoc(snapshot);
      const windowEvent = new CustomEvent(USER_MODIFIED_EVENT, {
        detail: userData,
      });
      window.dispatchEvent(windowEvent);
    }, console.log);
  });
  _unsubscribe = () => {
    allUnsubscribes.forEach((unsubscribe) => unsubscribe());
  };
}

export function unsubscribe() {
  _unsubscribe && _unsubscribe();
  _unsubscribe = undefined;
}

export default function listenChange(event: User) {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: ACTION_USERS_LISTEN_CHANGE, payload: event });
  };
}
