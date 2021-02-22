import firebase from "firebase/app";
import "firebase/auth";

export const ACTION_AUTH_AUTHENTICATED = 'auth/authenticated';
export const ACTION_AUTH_AUTHENTICATION_ERROR = 'auth/authentication_error';

export default function login(email, password) {
    return async (dispatch) => {
        try {
            const userCreds = await firebase.auth().signInWithEmailAndPassword(email, password);
            dispatch({ type: ACTION_AUTH_AUTHENTICATED, payload: userCreds});
        }
        catch (error) {
            dispatch({ type: ACTION_AUTH_AUTHENTICATION_ERROR, payload: error});
        }
    }
}