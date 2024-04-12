import { combineReducers } from "redux";
import answersReducer from "./reducers/answers";
import { AnswersState } from "./reducers/answers/reducer";
import authReducer, { AuthState } from "./reducers/auth/reducer";
import eventsReducer from "./reducers/events";
import usersReducer from "./reducers/users";
import { TastingEventsState } from "./reducers/events/reducer";
import resultsReducer from "./reducers/results";
import { ResultsState } from "./reducers/results/reducer";
import { UsersState } from "./reducers/users/reducer";

export type RootState = {
  auth: AuthState;
  events: TastingEventsState;
  answers: AnswersState;
  results: ResultsState;
  users: UsersState;
};

export type UserInfo = {
  uid: string;
  email: string;
};

export class StoreError extends Error {
  code: number | undefined = undefined;

  constructor(message: string, code?: number) {
    super(message);
    this.code = code;
  }
}

const rootReducer = combineReducers<RootState>({
  auth: authReducer,
  events: eventsReducer,
  answers: answersReducer,
  results: resultsReducer,
  users: usersReducer,
});
export default rootReducer;
