import firebase from "firebase/app";
import "firebase/firestore";

export const ACTION_EVENTS_ALLOW_EDIT_ALLOWING = 'events/allow_edit_allowing';
export const ACTION_EVENTS_ALLOW_EDIT = 'events/allow_edit';
export const ACTION_EVENTS_ALLOW_EDIT_ERROR = 'events/allow_edit_error';

export default function allowEdit(id, allow) {
    return async (dispatch) => {
        dispatch({ type: ACTION_EVENTS_ALLOW_EDIT_ALLOWING, payload: {id, allowing: true }});
        try {
            const docRef = firebase.firestore().collection('events').doc(id);
            await docRef.update({editingAllowed: allow});
            dispatch({ type: ACTION_EVENTS_ALLOW_EDIT, payload: {id, allowed: allow}});
        }
        catch (error) {
            dispatch({ type: ACTION_EVENTS_ALLOW_EDIT_ERROR, payload: {id, error }});
        }
        dispatch({ type: ACTION_EVENTS_ALLOW_EDIT_ALLOWING, payload: {id, allowing: false }});
    }
}