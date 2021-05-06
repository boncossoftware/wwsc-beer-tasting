import { AnyAction, Dispatch } from "redux";

export const ACTION_AUTH_RESET_LOGIN = 'events/reset_login';

export default function resetLogin() {
    return async (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: ACTION_AUTH_RESET_LOGIN});
    }
}