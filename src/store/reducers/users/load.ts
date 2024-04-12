import firebase, { FieldPath } from "store/firebase";
import "firebase/firestore";

import { subscribe } from "./listen-change";

import { AnyAction, Dispatch } from "redux";
import { RootState, StoreError } from "store/reducer";
import { eventFromDoc } from "../events/utils";
import { userFromDoc } from "./utils";
import { User } from "./reducer";

export const ACTION_USERS_LOADING = "users/loading";
export const ACTION_USERS_LOAD = "users/load";
export const ACTION_USERS_LOAD_ERROR = "users/load_error";

export default function load(eventId: string) {
  return async (
    dispatch: Dispatch<AnyAction>,
    getState: () => RootState,
    ...p: any[]
  ) => {
    dispatch({ type: ACTION_USERS_LOADING, payload: true });
    try {
      const { auth } = getState();
      if (!auth.user?.email) {
        throw new StoreError("No current user.");
      }
      const doc = await firebase
        .firestore()
        .collection("events")
        .doc(eventId)
        .get();
      const item = eventFromDoc(doc);
      const related = item.related ?? [];
      const gets = related.map((id) =>
        firebase.firestore().collection("users").doc(id!).get()
      );
      const result = await Promise.all(gets);
      const items = result.map(userFromDoc);
      const mixedItems = mixItems(related, items);
      dispatch({ type: ACTION_USERS_LOAD, payload: mixedItems });
      subscribe(related); //Listen for changes for this user.
    } catch (error) {
      dispatch({ type: ACTION_USERS_LOAD_ERROR, payload: error });
    }
    dispatch({ type: ACTION_USERS_LOADING, payload: false });
  };
}

function mixItems(related: (string | null)[], items: User[] | null): User[] {
  return related.map((id) => {
    const foundUser = items?.find((item) => item.id === id);
    return { id: id ?? "", email: id ?? "", ...foundUser };
  });
}
