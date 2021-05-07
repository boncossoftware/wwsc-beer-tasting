import { AnyAction, Dispatch } from "redux";
import firebase, {DocumentData} from "store/firebase";
import "firebase/firestore";
import { answerFromDoc } from "./utils";
import { RootState } from "store/reducer";

export const ACTION_EVENT_ANSWERS_ITEM_LOADING = 'event_answers/loading';
export const ACTION_EVENT_ANSWERS_LOAD_ITEM = 'event_answers/load_item';
export const ACTION_EVENT_ANSWERS_LOAD_ITEM_ERROR = 'event_answers/load_item_error';

const emptyList = (i=0) => { 
    let list = Array(i);
    for(i; i >= 0; i--)
        list[i] = null;
    return list;
};

export default function loadItem(id: string) {
    return async (dispatch: Dispatch<AnyAction>, getState: () => RootState) => {
        dispatch({ type: ACTION_EVENT_ANSWERS_ITEM_LOADING, payload: {id, loading: true }});
        try {
            const { auth } = getState();
            const eventDocRef = firebase.firestore().collection('events').doc(id);
            const itemRef = eventDocRef.collection('answers').doc(auth?.user?.uid);
            const [doc, event] = await Promise.all([
                itemRef.get(),
                eventDocRef.get()
            ]);
            if (!doc.exists) {
                const rounds = event?.data()?.rounds || 0;
                doc.data = () => ({
                    beers: [...emptyList(rounds)],
                    asterisks: [...emptyList(rounds)],
                    ratings: [...emptyList(rounds)],
                    changes: [...emptyList(rounds)],
                    rounds,
                });
                //NOTE: Casting because data always exits because we created it.
                await itemRef.set(doc.data() as DocumentData); 
            }
            const item = answerFromDoc(doc);
            dispatch({ type: ACTION_EVENT_ANSWERS_LOAD_ITEM, payload: item});
        }
        catch (error) {
            dispatch({ type: ACTION_EVENT_ANSWERS_LOAD_ITEM_ERROR, payload: {id, error }});
        }
        dispatch({ type: ACTION_EVENT_ANSWERS_ITEM_LOADING, payload: {id, loading: false }});
    }
}