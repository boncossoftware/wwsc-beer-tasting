import { AnyAction } from "redux";
import { StoreError } from "store/reducer";
import {
  ACTION_EVENT_RESULTS_CALCULATED,
  ACTION_EVENT_RESULTS_CALCULATE_ERROR,
  ACTION_EVENT_RESULTS_CALCULATING,
} from "./calculate";
import {
  ACTION_EVENT_RESULTS_ITEM_LOADING,
  ACTION_EVENT_RESULTS_LOAD_ITEM,
  ACTION_EVENT_RESULTS_LOAD_ITEM_ERROR,
} from "./load-item";
import { addOrUpdateItem } from "./utils";
import { ACTION_RESULTS_LISTEN_CHANGE } from "./listen-change";

export interface RoundResult {
  index: number;
  selectedBeer: string;
  correctBeer: string;
  correct: boolean;
  tasteScore: number;
  asterisked: boolean;
  points: number;
  changesMade: number;
}

export interface ResultSummary {
  userEmail: string;
  totalPoints: number;
  totalTaste: number;
  totalCorrectAsterisks: number;
  totalCorrectSecondHalf: number;
  totalChanges: number;
  roundResults: RoundResult[];
  beerScores: { [id: string]: number };
  isTied: boolean;
  tieBreakerReason: string | null;
}

export interface BeerRanking {
  name: string;
  points: number;
}

export type Result = {
  id: string;
  roundResults: ResultSummary[];
  beerScoreResults: BeerRanking[];
  lastUpdated: Date | undefined | null;
};

export type ResultsState = {
  loading: boolean;
  itemsLoading: { [key: string]: boolean };
  itemsError: { [key: string]: StoreError };
  items: Result[] | null;
  itemsCalculating: { [key: string]: boolean };
  itemsCalculationError: { [key: string]: StoreError };
};

const initialState: ResultsState = {
  loading: false,
  itemsLoading: {},
  itemsError: {},
  items: null,
  itemsCalculating: {},
  itemsCalculationError: {},
};

export default function resultsReducer(
  state: ResultsState = initialState,
  action: AnyAction
): ResultsState {
  let newState = { ...state };
  switch (action.type) {
    case ACTION_EVENT_RESULTS_ITEM_LOADING: {
      const { id, loading } = action.payload;
      newState.itemsLoading[id] = loading as boolean;
      return newState;
    }
    case ACTION_EVENT_RESULTS_CALCULATED:
    case ACTION_RESULTS_LISTEN_CHANGE:
    case ACTION_EVENT_RESULTS_LOAD_ITEM: {
      const item = action.payload;
      newState.items = addOrUpdateItem(item, state.items) as Result[];
      return newState;
    }
    case ACTION_EVENT_RESULTS_LOAD_ITEM_ERROR: {
      const { id, error } = action.payload;
      newState.itemsError[id] = error;
      return newState;
    }
    case ACTION_EVENT_RESULTS_CALCULATING: {
      const { id, calculating } = action.payload;
      newState.itemsCalculating[id] = calculating;
      return newState;
    }
    case ACTION_EVENT_RESULTS_CALCULATE_ERROR: {
      const { id, error } = action.payload;
      newState.itemsCalculationError[id] = error;
      return newState;
    }
    default: {
      return state;
    }
  }
}
