import { ACTION_EVENT_ANSWERS_LOAD_ITEM_ERROR } from "./load-item";
import { ACTION_EVENT_ANSWERS_LOAD_ITEM } from "./load-item";
import { ACTION_EVENT_ANSWERS_ITEM_LOADING } from "./load-item";

import { ACTION_EVENT_ANSWERS_UPDATING } from "./update";
import { ACTION_EVENT_ANSWERS_UPDATED } from "./update";
import { ACTION_EVENT_ANSWERS_UPDATE_ERROR } from "./update";

import { ACTION_EVENT_ANSWERS_UPDATE_RESET } from "./reset-update";
import { AnyAction } from "redux";
import { StoreError } from "store/reducer";
import { addOrUpdateItem } from "../results/utils";

export type TastingAnswer = {
  id: string;
  beers: (string | null)[] | undefined | null;
  asterisks: boolean[] | undefined | null;
  ratings: (number | null)[] | undefined | null;
  changes: number[] | undefined | null;
  rounds: number | undefined | null;
};

export type AnswersState = {
  loading: boolean;
  itemsLoading: { [key: string]: boolean };
  itemsError: { [key: string]: StoreError };
  items: TastingAnswer[] | null;
  update: {
    updating: boolean;
    updated: TastingAnswer[] | null;
    error: StoreError | null;
  };
};

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
};

export default function answersReducer(
  state: AnswersState = initialState,
  action: AnyAction
): AnswersState {
  let newState = { ...state };
  switch (action.type) {
    case ACTION_EVENT_ANSWERS_ITEM_LOADING: {
      const { id, loading } = action.payload;
      newState.itemsLoading[id] = loading;
      return newState;
    }
    case ACTION_EVENT_ANSWERS_LOAD_ITEM: {
      const item = action.payload;
      newState.items = addOrUpdateItem(item, state.items) as TastingAnswer[];
      return newState;
    }
    case ACTION_EVENT_ANSWERS_LOAD_ITEM_ERROR: {
      const { id, error } = action.payload;
      newState.itemsError[id] = error;
      return newState;
    }
    case ACTION_EVENT_ANSWERS_UPDATING: {
      newState.update.updating = action.payload;
      return newState;
    }
    case ACTION_EVENT_ANSWERS_UPDATED: {
      const item = action.payload;
      newState.update.updated = item;
      newState.items = addOrUpdateItem(item, state.items) as TastingAnswer[];
      return newState;
    }
    case ACTION_EVENT_ANSWERS_UPDATE_ERROR: {
      newState.update.error = action.payload;
      return newState;
    }
    case ACTION_EVENT_ANSWERS_UPDATE_RESET: {
      newState.update.updating = false;
      newState.update.updated = null;
      newState.update.error = null;
      return newState;
    }
    default: {
      return state;
    }
  }
}
