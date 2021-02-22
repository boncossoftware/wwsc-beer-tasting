import { 
    ACTION_EVENTS_ADD, 
    ACTION_EVENTS_ADDING, 
    ACTION_EVENTS_ADD_ERROR 
} from "./add";
import { 
    ACTION_EVENTS_LOAD, 
    ACTION_EVENTS_LOADING, 
    ACTION_EVENTS_LOAD_ERROR 
} from "./load";
import { ACTION_EVENTS_ADD_RESET } from "./reset-add";


const initialState = {
    loading: false,
    loaded: false,
    items: null,
    error: null,
    add: {
        adding: false,
        added: null,
        error: null,
    },
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
        case ACTION_EVENTS_ADDING: {
            state.add.adding = action.payload; 
            return state;
        }
        case ACTION_EVENTS_ADD: {
            state.add.added = action.payload; 
            return state;
        }
        case ACTION_EVENTS_ADD_ERROR: {
            state.add.added = action.payload; 
            return state;
        }
        case ACTION_EVENTS_ADD_RESET: {
            state.add.adding = false;
            state.add.added = null;
            state.add.error = null;
            return state;
        }
        default: {
            return state;
        }
    }
};
