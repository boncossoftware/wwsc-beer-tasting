import { AnyAction, Dispatch } from "redux";
import firebase from "firebase/app";
import 'firebase/auth';

var initialized = false;

export const ACTION_AUTH_INITIALIZED = 'auth/initialized';

export default function initialize() {
    return async (dispatch: Dispatch<AnyAction>) => {
        try {
            let user = null;
            if (!initialized) {
                let unsubscribe = () => {};
                user = await new Promise( res => { 
                    unsubscribe = firebase.auth().onAuthStateChanged( res ) 
                });
                unsubscribe();
                initialized = true;
            }
            else {
                user = firebase.auth().currentUser;
            }
            dispatch({ type: ACTION_AUTH_INITIALIZED, payload: user});
        }
        catch( error ) {
            //TODO handle error here.
            dispatch({ type: ACTION_AUTH_INITIALIZED, payload: null });
        }
    }
}