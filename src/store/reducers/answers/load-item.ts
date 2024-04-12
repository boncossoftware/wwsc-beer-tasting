import { AnyAction, Dispatch } from "redux";
import firebase, { DocumentData } from "@/store/firebase";
import "firebase/firestore";
import { answerFromDoc, newAnswersData } from "./utils";
import { RootState } from "@/store/reducer";
import { subscribe } from "./listen-change";

export const ACTION_EVENT_ANSWERS_ITEM_LOADING = "event_answers/loading";
export const ACTION_EVENT_ANSWERS_LOAD_ITEM = "event_answers/load_item";
export const ACTION_EVENT_ANSWERS_LOAD_ITEM_ERROR =
  "event_answers/load_item_error";

export default function loadItem(eventId: string) {
  return async (dispatch: Dispatch<AnyAction>, getState: () => RootState) => {
    const { auth } = getState();
    const id = auth?.user?.email;
    dispatch({
      type: ACTION_EVENT_ANSWERS_ITEM_LOADING,
      payload: { id, loading: true },
    });
    try {
      const eventDocRef = firebase
        .firestore()
        .collection("events")
        .doc(eventId);
      const itemRef = eventDocRef.collection("answers").doc(id);
      const [doc, event] = await Promise.all([
        itemRef.get(),
        eventDocRef.get(),
      ]);
      if (!doc.exists) {
        const rounds = event?.data()?.rounds || 0;
        doc.data = () => newAnswersData(rounds);
        //NOTE: Casting because data always exits because we created it.
        await itemRef.set(doc.data() as DocumentData);
      }
      const item = answerFromDoc(doc);
      if (id) {
        subscribe(eventId, id);
      }
      dispatch({ type: ACTION_EVENT_ANSWERS_LOAD_ITEM, payload: item });
    } catch (error) {
      dispatch({
        type: ACTION_EVENT_ANSWERS_LOAD_ITEM_ERROR,
        payload: { id, error },
      });
    }
    dispatch({
      type: ACTION_EVENT_ANSWERS_ITEM_LOADING,
      payload: { id, loading: false },
    });
  };
}
