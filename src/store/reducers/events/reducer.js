import { 
    ACTION_EVENTS_ADD, 
    ACTION_EVENTS_ADDING, 
    ACTION_EVENTS_ADD_ERROR 
} from "./add";
import { 
    ACTION_EVENTS_ALLOW_EDIT_ALLOWING,
    ACTION_EVENTS_ALLOW_EDIT,
    ACTION_EVENTS_ALLOW_EDIT_ERROR
} from "./allow-edit";
import { 
    ACTION_EVENTS_LOAD, 
    ACTION_EVENTS_LOADING, 
    ACTION_EVENTS_LOAD_ERROR 
} from "./load";
import { ACTION_EVENTS_ITEM_LOADING, ACTION_EVENTS_LOAD_ITEM, ACTION_EVENTS_LOAD_ITEM_ERROR } from "./load-item";
import { ACTION_EVENTS_ADD_RESET } from "./reset-add";

const initialState = {
    loading: false,
    itemsLoading: {},
    itemsError: {},
    loaded: false,
    items: null,
    error: null,
    add: {
        adding: false,
        added: null,
        error: null,
    },
    allowEditingAllowing: {},
    allowEditingError: {}
}

export default function eventsReducer(state = initialState, action) {
    switch(action.type) {
        case ACTION_EVENTS_LOADING: {
            state.loading = action.payload; 
            return state;
        }
        case ACTION_EVENTS_LOAD: {
            state.items = action.payload; 
            return state;
        }
        case ACTION_EVENTS_LOAD_ERROR: {
            state.items = null;
            state.error = action.payload;
            return state;
        }
        case ACTION_EVENTS_ITEM_LOADING: {
            const {id, loading} = action.payload;
            state.itemsLoading[id] = loading;
            return state;
        }
        case ACTION_EVENTS_LOAD_ITEM: {
            
            const item = action.payload;
            const index = state.items?.find( i => i.id === item.id);
            if (index >= 0) {
                state.items[index] = item;
            }
            else {
                state.items = [ ...(state.items || []), item];
            }
            return state;
        }
        case ACTION_EVENTS_LOAD_ITEM_ERROR: {
            const {id, error} = action.payload;
            state.itemsError[id] = error;
            return state;
        }
        case ACTION_EVENTS_ADDING: {
            state.add.adding = action.payload; 
            return state;
        }
        case ACTION_EVENTS_ADD: {
            state.add.added = action.payload; 
            return state;
        }
        case ACTION_EVENTS_ADD_ERROR: {
            state.add.error = action.payload; 
            return state;
        }
        case ACTION_EVENTS_ADD_RESET: {
            state.add.adding = false;
            state.add.added = null;
            state.add.error = null;
            return state;
        }
        case ACTION_EVENTS_ALLOW_EDIT_ALLOWING: {
            const {id, allowing} = action.payload;
            state.allowEditingAllowing[id] = allowing;
            return state;
        }
        case ACTION_EVENTS_ALLOW_EDIT: {
            const {id, allowed} = action.payload;
            state.items = state.items?.map( i => (i.id !== id) ? i : {...i,  editingAllowed: allowed}) ;
            return state;
        }
        case ACTION_EVENTS_ALLOW_EDIT_ERROR: {
            const {id, error} = action.payload;
            state.allowEditingError[id] = error; 
            return state;
        }
        default: {
            return state;
        }
    }
};
