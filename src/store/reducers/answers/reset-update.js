export const ACTION_EVENT_ANSWERS_UPDATE_RESET = 'event_answers/update_reset';

export default function resetAdd() {
    return async (dispatch) => {
        dispatch({ type: ACTION_EVENT_ANSWERS_UPDATE_RESET});
    }
}