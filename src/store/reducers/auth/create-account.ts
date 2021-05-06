import { AnyAction, Dispatch } from "redux";
import firebase from "firebase/app";
import "firebase/auth";

export const ACTION_AUTH_CREATING_ACCOUNT = 'auth/creating_account';
export const ACTION_AUTH_CREATE_ACCOUNT_CREATED = 'auth/create_account_created';
export const ACTION_AUTH_CREATE_ACCOUNT_ERROR = 'auth/create_account_error';

export default function createAccount(email: string, password: string) {
    return async (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: ACTION_AUTH_CREATING_ACCOUNT, payload: true});
        try {
            const userCreds = await firebase.auth().createUserWithEmailAndPassword(email, password);
            dispatch({ type: ACTION_AUTH_CREATE_ACCOUNT_CREATED, payload: userCreds});
        }
        catch (error) {
            dispatch({ type: ACTION_AUTH_CREATE_ACCOUNT_ERROR, payload: error});
        }
        finally {
            dispatch({ type: ACTION_AUTH_CREATING_ACCOUNT, payload: false});
        }
    }
}