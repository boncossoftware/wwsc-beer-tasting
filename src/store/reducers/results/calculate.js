import firebase from "../../firebase";
import "firebase/functions";

export const ACTION_EVENT_RESULTS_CALCULATING = 'event_results/calulating';
export const ACTION_EVENT_RESULTS_CALCULATED = 'event_results/calcutate';
export const ACTION_EVENT_RESULTS_CALCULATE_ERROR = 'event_results/calculate_error';

export default function calculate(id) {
    return async (dispatch) => {
        dispatch({ type: ACTION_EVENT_RESULTS_CALCULATING, payload: {id, calculating: true }});
        try {
            const calculateResults = firebase.functions().httpsCallable('calculateResults');
            const response = await calculateResults(id);
            const data = response?.data || {};
            if (data?.error) {
                const error = new Error(data.error?.message);
                error.code = data.error?.code;
                throw error;
            }
            else {
                const results = {id, ...data };
                dispatch({ type: ACTION_EVENT_RESULTS_CALCULATED, payload: results});
            }
        }
        catch (error) {
            dispatch({ type: ACTION_EVENT_RESULTS_CALCULATE_ERROR, payload: {id, error }});
        }
        dispatch({ type: ACTION_EVENT_RESULTS_CALCULATING, payload: {id, calculating: false }});
    }
}