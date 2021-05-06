import { AnyAction, Dispatch } from "redux";

export const ACTION_EVENTS_UPDATE_RESET = 'events/update_reset';

export default function resetUpdate() {
    return async (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: ACTION_EVENTS_UPDATE_RESET});
    }
}