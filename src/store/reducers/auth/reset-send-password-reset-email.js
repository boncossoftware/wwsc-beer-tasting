export const ACTION_AUTH_RESET_SEND_PASSWORD_RESET_EMAIL = 'events/reset_send_password_reset_email';

export default function resetSendPasswordResetEmail() {
    return async (dispatch) => {
        dispatch({ type: ACTION_AUTH_RESET_SEND_PASSWORD_RESET_EMAIL});
    }
}