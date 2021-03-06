import { ACTION_EVENT_ANSWERS_LOAD_ITEM_ERROR } from "./load-item";
import { ACTION_EVENT_ANSWERS_LOAD_ITEM } from "./load-item";
import { ACTION_EVENT_ANSWERS_ITEM_LOADING } from "./load-item";

import { ACTION_EVENT_ANSWERS_UPDATING } from "./update";
import { ACTION_EVENT_ANSWERS_UPDATED } from "./update";
import { ACTION_EVENT_ANSWERS_UPDATE_ERROR } from "./update";

import { ACTION_EVENT_ANSWERS_UPDATE_RESET } from './reset-update';

const initialState = {
    loading: false,
    itemsLoading: {},
    itemsError: {},
    items: null,
    update: {
        updating: false,
        updated: null,
        error: null,
    },
}

export default function answersReducer(state = initialState, action) {
    switch(action.type) {
        case ACTION_EVENT_ANSWERS_ITEM_LOADING: {
            const {id, loading} = action.payload;
            state.itemsLoading[id] = loading;
            return state;
        }
        case ACTION_EVENT_ANSWERS_LOAD_ITEM: {
            const item = action.payload;
            state.items = [ ...( state.items?.map( i => (i.id !== item.id) ? i : item ) || [item] ) ];
            return state;
        }
        case ACTION_EVENT_ANSWERS_LOAD_ITEM_ERROR: {
            const {id, error} = action.payload;
            state.itemsError[id] = error;
            return state;
        }
        case ACTION_EVENT_ANSWERS_UPDATING: {
            state.update.updating = action.payload; 
            return state;
        }
        case ACTION_EVENT_ANSWERS_UPDATED: {
            state.update.updated = action.payload; 
            return state;
        }
        case ACTION_EVENT_ANSWERS_UPDATE_ERROR: {
            state.update.error = action.payload;
            return state;
        }
        case ACTION_EVENT_ANSWERS_UPDATE_RESET: {
            state.update.updating = false;
            state.update.updated = null;
            state.update.error = null;
            return state;
        }
        default: {
            return state;
        }
    }
};
