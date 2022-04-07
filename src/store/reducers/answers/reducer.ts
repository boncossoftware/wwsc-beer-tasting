import { ACTION_EVENT_ANSWERS_LOAD_ITEM_ERROR } from "./load-item";
import { ACTION_EVENT_ANSWERS_LOAD_ITEM } from "./load-item";
import { ACTION_EVENT_ANSWERS_ITEM_LOADING } from "./load-item";

import { ACTION_EVENT_ANSWERS_UPDATING } from "./update";
import { ACTION_EVENT_ANSWERS_UPDATED } from "./update";
import { ACTION_EVENT_ANSWERS_UPDATE_ERROR } from "./update";

import { ACTION_EVENT_ANSWERS_UPDATE_RESET } from "./reset-update";
import { AnyAction } from "redux";
import { StoreError } from "store/reducer";

export type TastingAnswer = {
  id: string | undefined | null;
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
  switch (action.type) {
    case ACTION_EVENT_ANSWERS_ITEM_LOADING: {
      const { id, loading } = action.payload;
      state.itemsLoading[id] = loading;
      return { ...initialState, ...state };
    }
    case ACTION_EVENT_ANSWERS_LOAD_ITEM: {
      const item = action.payload;
      state.items = [
        ...(state.items?.map((i) => (i.id !== item.id ? i : item)) || [item]),
      ];
      return { ...initialState, ...state };
    }
    case ACTION_EVENT_ANSWERS_LOAD_ITEM_ERROR: {
      const { id, error } = action.payload;
      state.itemsError[id] = error;
      return { ...initialState, ...state };
    }
    case ACTION_EVENT_ANSWERS_UPDATING: {
      state.update.updating = action.payload;
      return { ...initialState, ...state };
    }
    case ACTION_EVENT_ANSWERS_UPDATED: {
      const item = action.payload;
      state.update.updated = item;
      state.items = [
        ...(state.items?.map((i) => (i.id !== item.id ? i : item)) || [item]),
      ];
      return { ...initialState, ...state };
    }
    case ACTION_EVENT_ANSWERS_UPDATE_ERROR: {
      state.update.error = action.payload;
      return { ...initialState, ...state };
    }
    case ACTION_EVENT_ANSWERS_UPDATE_RESET: {
      state.update.updating = false;
      state.update.updated = null;
      state.update.error = null;
      return { ...initialState, ...state };
    }
    default: {
      return { ...initialState, ...state };
    }
  }
}
