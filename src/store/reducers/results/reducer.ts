import { AnyAction } from "redux";
import { StoreError } from "store/reducer";
import {
  ACTION_EVENT_RESULTS_CALCULATED,
  ACTION_EVENT_RESULTS_CALCULATE_ERROR,
  ACTION_EVENT_RESULTS_CALCULATING,
} from "./calculate";
import { ACTION_EVENT_RESULTS_LOAD_ITEM_ERROR } from "./load-item";
import { ACTION_EVENT_RESULTS_LOAD_ITEM } from "./load-item";
import { ACTION_EVENT_RESULTS_ITEM_LOADING } from "./load-item";

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
  totalAsterisks: number;
  totalAsterisksSecondHalf: number;
  totalChanges: number;
  roundResults: RoundResult[];
  beerScores: { [id: string]: number };
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
  switch (action.type) {
    case ACTION_EVENT_RESULTS_ITEM_LOADING: {
      const { id, loading } = action.payload;
      state.itemsLoading[id] = loading as boolean;
      return { ...initialState, ...state };
    }
    case ACTION_EVENT_RESULTS_LOAD_ITEM: {
      const item = action.payload;
      state.items = [
        ...(state.items?.map((i) => (i.id !== item.id ? i : item)) || [item]),
      ];
      return { ...initialState, ...state };
    }
    case ACTION_EVENT_RESULTS_LOAD_ITEM_ERROR: {
      const { id, error } = action.payload;
      state.itemsError[id] = error;
      return { ...initialState, ...state };
    }
    case ACTION_EVENT_RESULTS_CALCULATING: {
      const { id, calculating } = action.payload;
      state.itemsCalculating[id] = calculating;
      return { ...initialState, ...state };
    }
    case ACTION_EVENT_RESULTS_CALCULATED: {
      const item = action.payload;
      state.items = [
        ...(state.items?.map((i) => (i.id !== item.id ? i : item)) || [item]),
      ];
      return { ...initialState, ...state };
    }
    case ACTION_EVENT_RESULTS_CALCULATE_ERROR: {
      const { id, error } = action.payload;
      state.itemsCalculationError[id] = error;
      return { ...initialState, ...state };
    }
    default: {
      return { ...initialState, ...state };
    }
  }
}
