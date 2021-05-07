import { combineReducers } from 'redux';
import answersReducer from './reducers/answers';
import { AnswersState } from './reducers/answers/reducer';
import authReducer from './reducers/auth/reducer';
import { AuthState } from './reducers/auth/reducer';
import eventsReducer from './reducers/events';
import { TastingEventsState } from './reducers/events/reducer';
import resultsReducer from './reducers/results';
import { ResultsState } from './reducers/results/reducer';

export type RootState = {
    auth: AuthState,
    events: TastingEventsState,
    answers: AnswersState,
    results: ResultsState,
}

export type UserInfo = {
    uid: string,
    email: string
}

export class StoreError extends Error {
    code: number|undefined = undefined;
    
    constructor(message: string, code?: number) {
        super(message);
        this.code = code;
    }
}

const rootReducer = combineReducers<RootState>({
    auth: authReducer,
    events: eventsReducer,
    answers: answersReducer,
    results: resultsReducer
});
export default rootReducer;