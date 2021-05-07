import { AnyAction, Dispatch } from "redux";

export const ACTION_EVENTS_ADD_RESET = 'events/add_reset';

export default function resetAdd() {
    return async (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: ACTION_EVENTS_ADD_RESET});
    }
}