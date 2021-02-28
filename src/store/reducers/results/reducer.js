import { ACTION_EVENT_RESULTS_CALCULATED, ACTION_EVENT_RESULTS_CALCULATE_ERROR, ACTION_EVENT_RESULTS_CALCULATING } from "./calculate";
import { ACTION_EVENT_RESULTS_LOAD_ITEM_ERROR } from "./load-item";
import { ACTION_EVENT_RESULTS_LOAD_ITEM } from "./load-item";
import { ACTION_EVENT_RESULTS_ITEM_LOADING } from "./load-item";


const initialState = {
    loading: false,
    itemsLoading: {},
    itemsError: {},
    items: null,
    itemsCalculating: {},
    itemsCalculationError: {},
}

export default function resultsReducer(state = initialState, action) {
    switch(action.type) {
        case ACTION_EVENT_RESULTS_ITEM_LOADING: {
            const {id, loading} = action.payload;
            state.itemsLoading[id] = loading;
            return state;
        }
        case ACTION_EVENT_RESULTS_LOAD_ITEM: {
            const item = action.payload;
            state.items = [ ...( state.items?.map( i => (i.id !== item.id) ? i : item ) || [item] ) ];
            return state;
        }
        case ACTION_EVENT_RESULTS_LOAD_ITEM_ERROR: {
            const {id, error} = action.payload;
            state.itemsError[id] = error;
            return state;
        }
        case ACTION_EVENT_RESULTS_CALCULATING: {
            const {id, calculating} = action.payload;
            state.itemsCalculating[id] = calculating;
            return state;
        }
        case ACTION_EVENT_RESULTS_CALCULATED: {
            const item = action.payload;
            state.items = [ ...( state.items?.map( i => (i.id !== item.id) ? i : item ) || [item] ) ];
            return state;
        }
        case ACTION_EVENT_RESULTS_CALCULATE_ERROR: {
            const {id, error} = action.payload;
            state.itemsCalculationError[id] = error;
            return state;
        }
        default: {
            return state;
        }
    }
};
