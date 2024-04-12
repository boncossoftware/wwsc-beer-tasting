import { StoreError } from "../../reducer";
import { AnyAction } from "redux";
import { addOrUpdateItem } from "../results/utils";
import {
  ACTION_USERS_LOAD,
  ACTION_USERS_LOADING,
  ACTION_USERS_LOAD_ERROR,
} from "./load";
import { ACTION_USERS_LISTEN_CHANGE } from "./listen-change";

export type User = {
  id: string;
  email: string;
  displayName?: string | null;
};

export type UsersState = {
  loading: boolean;
  itemsLoading: { [key: string]: boolean };
  itemsError: { [key: string]: StoreError };
  loaded: boolean;
  items: User[] | null;
  error: StoreError | null;
};

const initialState: UsersState = {
  loading: false,
  itemsLoading: {},
  itemsError: {},
  loaded: false,
  items: null,
  error: null,
};

const sortUsers = (i1: User, i2: User): number => {
  return i2?.displayName?.localeCompare(i1?.displayName ?? "") ?? 0;
};

export default function eventsReducer(
  state: UsersState = initialState,
  action: AnyAction
): UsersState {
  let newState = { ...state };
  switch (action.type) {
    case ACTION_USERS_LOADING: {
      newState.loading = action.payload;
      return newState;
    }
    case ACTION_USERS_LOAD: {
      newState.items = action.payload?.sort(sortUsers);
      return newState;
    }
    case ACTION_USERS_LOAD_ERROR: {
      newState.items = null;
      newState.error = action.payload;
      return newState;
    }
    case ACTION_USERS_LISTEN_CHANGE: {
      const user = action.payload;
      newState.items = (addOrUpdateItem(user, state.items) as User[]).sort(
        sortUsers
      );
      return newState;
    }
    default: {
      return state;
    }
  }
}
