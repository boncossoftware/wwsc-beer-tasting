import firebase from "@/store/firebase";
import "firebase/firestore";

import { subscribe } from "./listen-change";

import { AnyAction, Dispatch } from "redux";
import { RootState, StoreError } from "@/store/reducer";
import { eventFromDoc } from "../events/utils";
import { FieldPath } from "@google-cloud/firestore";
import { userFromDoc } from "./utils";

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

      const usersColRef = firebase
        .firestore()
        .collection("users")
        .where(FieldPath.documentId(), "in", item.related ?? [])
        .orderBy("displayName", "asc");
      const result = await usersColRef.get();
      const items = result.docs.map(userFromDoc);
      dispatch({ type: ACTION_USERS_LOAD, payload: items });
      subscribe(item.related ?? []); //Listen for changes for this user.
    } catch (error) {
      dispatch({ type: ACTION_USERS_LOAD_ERROR, payload: error });
    }
    dispatch({ type: ACTION_USERS_LOADING, payload: false });
  };
}
