export const ACTION_EVENTS_ADD_RESET = 'events/add_reset';

export default function resetAdd() {
    return async (dispatch) => {
        dispatch({ type: ACTION_EVENTS_ADD_RESET});
    }
}