import firebase from "firebase/app";
import "firebase/auth";

export const ACTION_AUTH_LOGOUT = 'auth/logout';

export default function logout() {
    return async (dispatch) => {
        try {
            await firebase.auth().signOut();
            dispatch({ type: ACTION_AUTH_LOGOUT });
        }
        catch( error ) {
            console.error(error);
        }
    }
}