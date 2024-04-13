import {
  ACTION_EVENTS_ADD,
  ACTION_EVENTS_ADDING,
  ACTION_EVENTS_ADD_ERROR,
} from "./add";
import { ACTION_EVENTS_ADD_RESET } from "./reset-add";
import {
  ACTION_EVENTS_UPDATE,
  ACTION_EVENTS_UPDATE_ERROR,
  ACTION_EVENTS_UPDATING,
} from "./update";
import { ACTION_EVENTS_UPDATE_RESET } from "./reset-update";
import {
  ACTION_EVENTS_ALLOW_EDIT_ALLOWING,
  ACTION_EVENTS_ALLOW_EDIT,
  ACTION_EVENTS_ALLOW_EDIT_ERROR,
} from "./allow-edit";
import {
  ACTION_EVENTS_LOAD,
  ACTION_EVENTS_LOADING,
  ACTION_EVENTS_LOAD_ERROR,
} from "./load";
import {
  ACTION_EVENTS_ITEM_LOADING,
  ACTION_EVENTS_ITEM_LOAD,
  ACTION_EVENTS_ITEM_LOAD_ERROR,
} from "./load-item";
import { StoreError } from "../../reducer";

import {
  ACTION_EVENTS_LISTEN_CHANGE,
  ACTION_EVENTS_LISTEN_REMOVE,
} from "./listen-change"; //Also listens for event changes
import { AnyAction } from "redux";
import { addOrUpdateItem } from "../results/utils";

export type TastingEvent = {
  id: string;
  owner: string | undefined | null;
  name: string | undefined | null;
  venue: string | undefined | null;
  date: Date | undefined | null;
  price: string | undefined | null;
  related: (string | null)[] | undefined | null;
  bartender: string | undefined | null;
  tasters: (string | null)[] | undefined | null;
  beers: (string | null)[] | undefined | null;
  asterisksAllowed: number | undefined | null;
  editingAllowed: boolean | undefined | null;
  rounds: number | undefined | null;

  //Helper Methods
  formattedDate: () => string;
  formattedMonth: () => string;
};

export type TastingEventsState = {
  loading: boolean;
  itemsLoading: { [key: string]: boolean };
  itemsError: { [key: string]: StoreError };
  loaded: boolean;
  items: TastingEvent[] | null;
  error: StoreError | null;
  add: {
    adding: boolean;
    added: TastingEvent | null;
    error: StoreError | null;
  };
  update: {
    updating: boolean;
    updated: TastingEvent | null;
    error: StoreError | null;
  };
  allowEditingAllowing: { [key: string]: boolean };
  allowEditingError: { [key: string]: StoreError };
};

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
  allowEditingError: {},
};

const sortItems = (i1: TastingEvent, i2: TastingEvent): number => {
  return (i2?.date?.getTime() ?? 0) - (i1?.date?.getTime() ?? 0);
};

export default function eventsReducer(
  state: TastingEventsState = initialState,
  action: AnyAction
): TastingEventsState {
  let newState = { ...state };
  switch (action.type) {
    case ACTION_EVENTS_LOADING: {
      newState.loading = action.payload;
      return newState;
    }
    case ACTION_EVENTS_LOAD: {
      newState.items = action.payload?.sort(sortItems);
      return newState;
    }
    case ACTION_EVENTS_LOAD_ERROR: {
      newState.items = null;
      newState.error = action.payload;
      return newState;
    }
    case ACTION_EVENTS_ITEM_LOADING: {
      const { id, loading } = action.payload;
      newState.itemsLoading[id] = loading;
      return newState;
    }
    case ACTION_EVENTS_LISTEN_CHANGE:
    case ACTION_EVENTS_ITEM_LOAD: {
      const item = action.payload;
      newState.items = (
        addOrUpdateItem(item, state.items) as TastingEvent[]
      ).sort(sortItems);
      return newState;
    }
    case ACTION_EVENTS_ITEM_LOAD_ERROR: {
      const { id, error } = action.payload;
      newState.itemsError[id] = error;
      return newState;
    }
    case ACTION_EVENTS_ADDING: {
      newState.add.adding = action.payload;
      return newState;
    }
    case ACTION_EVENTS_ADD: {
      const item = action.payload;
      newState.add.added = item;
      newState.items = [item, ...(newState.items || [])].sort(sortItems);
      return newState;
    }
    case ACTION_EVENTS_ADD_ERROR: {
      newState.add.error = action.payload;
      return newState;
    }
    case ACTION_EVENTS_ADD_RESET: {
      newState.add.adding = false;
      newState.add.added = null;
      newState.add.error = null;
      return newState;
    }
    case ACTION_EVENTS_UPDATING: {
      newState.update.updating = action.payload;
      return newState;
    }
    case ACTION_EVENTS_UPDATE: {
      const item = action.payload;
      newState.update.updated = item;
      newState.items = (
        addOrUpdateItem(item, state.items) as TastingEvent[]
      ).sort(sortItems);
      return newState;
    }
    case ACTION_EVENTS_UPDATE_ERROR: {
      newState.update.error = action.payload;
      return newState;
    }
    case ACTION_EVENTS_UPDATE_RESET: {
      newState.update.updating = false;
      newState.update.updated = null;
      newState.update.error = null;
      return newState;
    }
    case ACTION_EVENTS_ALLOW_EDIT_ALLOWING: {
      const { id, allowing } = action.payload;
      newState.allowEditingAllowing[id] = allowing;
      return newState;
    }
    case ACTION_EVENTS_ALLOW_EDIT: {
      const { id, allowed } = action.payload;
      newState.items = [
        ...(newState.items?.map((i) =>
          i.id !== id ? i : { ...i, editingAllowed: allowed }
        ) || []),
      ];
      return newState;
    }
    case ACTION_EVENTS_ALLOW_EDIT_ERROR: {
      const { id, error } = action.payload;
      newState.allowEditingError[id] = error;
      return newState;
    }
    case ACTION_EVENTS_LISTEN_REMOVE: {
      const itemId = action.payload;
      newState.items =
        newState.items?.filter((item) => item.id !== itemId) || [];
      return newState;
    }
    default: {
      return state;
    }
  }
}
