import {firebase} from "../../firebase";
import 'firebase/auth';

var initialized = false;
firebase.auth().onAuthStateChanged( (user) => {
    if (initialized) return;
    initialized = true;
});

export const ACTION_AUTH_INITIALIZED = 'auth/initialized';

export default function initialize() {
    return async (dispatch) => {
        try {
            let user = null;
            if (!initialized) {
                let unsubscribe = null;
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