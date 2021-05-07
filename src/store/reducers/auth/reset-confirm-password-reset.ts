import { AnyAction, Dispatch } from "redux";

export const ACTION_AUTH_RESET_CONFIRM_PASSWORD_RESET = 'events/reset_confirm_password_reset';

export default function resetConfirmPasswordReset() {
    return async (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: ACTION_AUTH_RESET_CONFIRM_PASSWORD_RESET});
    }
}