import { 
    ACTION_EVENTS_ADD, 
    ACTION_EVENTS_ADDING, 
    ACTION_EVENTS_ADD_ERROR 
} from "./add";
import { ACTION_EVENTS_ADD_RESET } from "./reset-add";
import { 
    ACTION_EVENTS_UPDATE, 
    ACTION_EVENTS_UPDATE_ERROR, 
    ACTION_EVENTS_UPDATING 
} from "./update";
import { ACTION_EVENTS_UPDATE_RESET } from "./reset-update";
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
import { 
    ACTION_EVENTS_ITEM_LOADING, 
    ACTION_EVENTS_ITEM_LOAD, 
    ACTION_EVENTS_ITEM_LOAD_ERROR 
} from "./load-item";
import {StoreError} from '../../reducer';

import { ACTION_EVENTS_LISTEN_CHANGE } from './listen-change'; //Also listens for event changes
import { AnyAction } from "redux";

export type TastingEvent = {
    id: string;
    owner: string|undefined|null;
    name: string|undefined|null;
    venue: string|undefined|null;
    date: Date|undefined|null;
    price: string|undefined|null;
    related: string[]|undefined|null;
    bartender: string|undefined|null;
    tasters: string[]|undefined|null;
    ownerAddedAsTaster: boolean|undefined|null;
    beers: string[]|undefined|null;
    asterisksAllowed: number|undefined|null;
    editingAllowed: boolean|undefined|null;
    rounds: number|undefined|null;

    //Helper Methods
    formattedDate: () => string;
    formattedMonth: () => string;
}

export type TastingEventsState = {
    loading: boolean;
    itemsLoading: {[key: string]: boolean};
    itemsError: {[key: string]: StoreError};
    loaded: boolean;
    items: TastingEvent[]|null;
    error: StoreError|null;
    add: {
        adding: boolean,
        added: TastingEvent|null,
        error: StoreError|null,
    },
    update: {
        updating: boolean,
        updated: TastingEvent|null,
        error: StoreError|null,
    },
    allowEditingAllowing: {[key: string]: boolean};
    allowEditingError: {[key: string]: StoreError};
}

const initialState: TastingEventsState = {
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
    update: {
        updating: false,
        updated: null,
        error: null,
    },
    allowEditingAllowing: {},
    allowEditingError: {}
}

const sortItems = (i1: TastingEvent, i2: TastingEvent): number => {
    return (i2?.date?.getTime()||0) - (i1?.date?.getTime()||0);
}

export default function eventsReducer(
    state:TastingEventsState=initialState, 
    action: AnyAction
): TastingEventsState {
    switch(action.type) {
        case ACTION_EVENTS_LOADING: {
            state.loading = action.payload; 
            return state;
        }
        case ACTION_EVENTS_LOAD: {
            state.items = action.payload?.sort(sortItems); 
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
        case ACTION_EVENTS_ITEM_LOAD: {
            const item = action.payload;
            state.items = [ ...( state.items?.map( i => (i.id !== item.id) ? i : item ) || [item] ) ].sort(sortItems);
            return state;
        }
        case ACTION_EVENTS_ITEM_LOAD_ERROR: {
            const {id, error} = action.payload;
            state.itemsError[id] = error;
            return state;
        }
        case ACTION_EVENTS_ADDING: {
            state.add.adding = action.payload; 
            return state;
        }
        case ACTION_EVENTS_ADD: {
            const item = action.payload;
            state.add.added = item; 
            state.items = [ item, ...(state.items||[]) ].sort(sortItems);
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
        case ACTION_EVENTS_UPDATING: {
            state.update.updating = action.payload; 
            return state;
        }
        case ACTION_EVENTS_UPDATE: {
            const item = action.payload;
            state.update.updated = item;
            state.items = [ ...( state.items?.map( i => (i.id !== item.id) ? i : item ) || [item] ) ];
            return state;
        }
        case ACTION_EVENTS_UPDATE_ERROR: {
            state.update.error = action.payload; 
            return state;
        }
        case ACTION_EVENTS_UPDATE_RESET: {
            state.update.updating = false;
            state.update.updated = null;
            state.update.error = null;
            return state;
        }
        case ACTION_EVENTS_ALLOW_EDIT_ALLOWING: {
            const {id, allowing} = action.payload;
            state.allowEditingAllowing[id] = allowing;
            return state;
        }
        case ACTION_EVENTS_ALLOW_EDIT: {
            const {id, allowed} = action.payload;
            state.items = [ ...(state.items?.map( i => (i.id !== id) ? i : {...i,  editingAllowed: allowed}) || []) ];
            return state;
        }
        case ACTION_EVENTS_ALLOW_EDIT_ERROR: {
            const {id, error} = action.payload;
            state.allowEditingError[id] = error; 
            return state;
        }
        case ACTION_EVENTS_LISTEN_CHANGE: {
            const event = action.payload;
            state.items = [ ...(state.items?.map( i => (i.id !== event.id) ? i : event) || []) ];
            return state;
        }
        default: {
            return state;
        }
    }
};

