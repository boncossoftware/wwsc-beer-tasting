import firebase from "store/firebase";
import "firebase/auth";
import { AnyAction, Dispatch } from "redux";

export const ACTION_AUTH_SENDING_PASSWORD_RESET_EMAIL =
  "auth/sending_password_reset_email";
export const ACTION_AUTH_SEND_PASSWORD_RESET_EMAIL_SENT =
  "auth/send_password_reset_email_sent";
export const ACTION_AUTH_SEND_PASSWORD_RESET_EMAIL_ERROR =
  "auth/send_password_reset_email_error";

export default function sendPasswordResetEmail(email: string) {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: ACTION_AUTH_SENDING_PASSWORD_RESET_EMAIL, payload: true });
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      dispatch({ type: ACTION_AUTH_SEND_PASSWORD_RESET_EMAIL_SENT });
    } catch (error) {
      dispatch({
        type: ACTION_AUTH_SEND_PASSWORD_RESET_EMAIL_ERROR,
        payload: error,
      });
    } finally {
      dispatch({
        type: ACTION_AUTH_SENDING_PASSWORD_RESET_EMAIL,
        payload: false,
      });
    }
  };
}
