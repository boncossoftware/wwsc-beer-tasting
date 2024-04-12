import "firebase/auth";
import "firebase/firestore";
import firebase, { QuerySnapshot, getCurrentUserInfo } from "store/firebase";

import { AnyAction, Dispatch } from "redux";
import { RootState, StoreError } from "store/reducer";
import { newAnswersData } from "../answers/utils";
import { TastingEvent } from "./reducer";
import { eventFromDoc, eventToDocData, propsForEvent } from "./utils";

export const ACTION_EVENTS_UPDATING = "events/updating";
export const ACTION_EVENTS_UPDATE = "events/update";
export const ACTION_EVENTS_UPDATE_ERROR = "events/update_error";

export default function update(event: TastingEvent) {
  return async (dispatch: Dispatch<AnyAction>, getState: () => RootState) => {
    dispatch({ type: ACTION_EVENTS_UPDATING, payload: true });
    try {
      const { email } = getCurrentUserInfo();
      if (!event?.id) {
        throw new StoreError("Event does not have an ID");
      }

      const props = propsForEvent(email, event); //Add the owner as related.
      const docRef = firebase.firestore().collection("events").doc(event.id);
      const resultsRef = firebase
        .firestore()
        .collection("results")
        .doc(event.id);
      const answersRef = docRef.collection("answers");
      await Promise.all([
        docRef.update(eventToDocData(props)),
        //Reset all answers.
        answersRef.get().then((snaps: QuerySnapshot) => {
          return Promise.all(
            snaps?.docs?.map((snap) =>
              snap?.ref.set(newAnswersData(event.rounds ?? 0))
            ) ?? []
          );
        }),
        //Delete all results.
        resultsRef.delete(),
      ]);

      const doc = await docRef.get();
      event = eventFromDoc(doc);
      dispatch({ type: ACTION_EVENTS_UPDATE, payload: event });
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION_EVENTS_UPDATE_ERROR, payload: error });
    }
    dispatch({ type: ACTION_EVENTS_UPDATING, payload: false });
  };
}
