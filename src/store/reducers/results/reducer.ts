import { AnyAction } from "redux";
import { ACTION_EVENT_RESULTS_CALCULATED, ACTION_EVENT_RESULTS_CALCULATE_ERROR, ACTION_EVENT_RESULTS_CALCULATING } from "./calculate";
import { ACTION_EVENT_RESULTS_LOAD_ITEM_ERROR } from "./load-item";
import { ACTION_EVENT_RESULTS_LOAD_ITEM } from "./load-item";
import { ACTION_EVENT_RESULTS_ITEM_LOADING } from "./load-item";

export type Result = {
    id: string;
    beerSelection: string[]|undefined|null;
    tasteScore: number[]|undefined|null;
    beerLover: string|undefined|null;
    beerHater: string|undefined|null;
    lastUpdated: Date|undefined|null;
}

export type ResultsState = {
    loading: boolean;
    itemsLoading: {[key: string]: boolean};
    itemsError: {[key: string]: Error};
    items: Result[]|null;
    itemsCalculating: {[key: string]: boolean};
    itemsCalculationError: {[key: string]: Error};
}

const initialState: ResultsState = {
    loading: false,
    itemsLoading: {},
    itemsError: {},
    items: null,
    itemsCalculating: {},
    itemsCalculationError: {},
}

export default function resultsReducer(
    state:ResultsState=initialState, 
    action: AnyAction
): ResultsState {
    switch(action.type) {
        case ACTION_EVENT_RESULTS_ITEM_LOADING: {
            const {id, loading} = action.payload;
            state.itemsLoading[id] = loading as boolean;
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
