export const ACTION_AUTH_RESET_LOGIN = 'events/reset_login';

export default function resetLogin() {
    return async (dispatch) => {
        dispatch({ type: ACTION_AUTH_RESET_LOGIN});
    }
}