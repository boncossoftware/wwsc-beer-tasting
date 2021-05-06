import { AnyAction, Dispatch } from "redux";
import firebase from "firebase/app";
import "firebase/auth";

export const ACTION_AUTH_CONFIRMING_RESET_PASSWORD = 'auth/confirming_reset_password';
export const ACTION_AUTH_CONFIRM_RESET_PASSWORD_CONFIRMED = 'auth/confirm_reset_password_confirmed';
export const ACTION_AUTH_CONFIRM_RESET_PASSWORD_ERROR = 'auth/confirm_reset_password_error';

export const RESET_PASSWORD_CONFIRM_MODE_RESET_PASSWORD = 'resetPassword';

export default function confirmPasswordReset(code: string, newPassword: string) {
    return async (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: ACTION_AUTH_CONFIRMING_RESET_PASSWORD, payload: true});
        try {
            await firebase.auth().confirmPasswordReset(code, newPassword);
            dispatch({ type: ACTION_AUTH_CONFIRM_RESET_PASSWORD_CONFIRMED });
        }
        catch (error) {
            dispatch({ type: ACTION_AUTH_CONFIRM_RESET_PASSWORD_ERROR, payload: error});
        }
        finally {
            dispatch({ type: ACTION_AUTH_CONFIRMING_RESET_PASSWORD, payload: false});
        }
    }
}