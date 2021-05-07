import { AnyAction, Dispatch } from "redux";
import firebase from 'store/firebase';
import "firebase/auth";

export const ACTION_AUTH_LOGGING_IN = 'auth/logging_in';
export const ACTION_AUTH_LOG_IN_LOGGED_IN = 'auth/log_in_logged_in';
export const ACTION_AUTH_LOG_IN_ERROR = 'auth/log_in_error';

export default function login(email: string, password: string) {
    return async (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: ACTION_AUTH_LOGGING_IN, payload: true});
        try {
            const userCreds = await firebase.auth().signInWithEmailAndPassword(email, password);
            dispatch({ type: ACTION_AUTH_LOG_IN_LOGGED_IN, payload: userCreds});
        }
        catch (error) {
            dispatch({ type: ACTION_AUTH_LOG_IN_ERROR, payload: error});
        }
        finally {
            dispatch({ type: ACTION_AUTH_LOGGING_IN, payload: false});
        }
    }
}