export const ACTION_AUTH_RESET_CREATE_ACCOUNT = 'events/reset_create_account';

export default function resetCreateAccount() {
    return async (dispatch) => {
        dispatch({ type: ACTION_AUTH_RESET_CREATE_ACCOUNT});
    }
}