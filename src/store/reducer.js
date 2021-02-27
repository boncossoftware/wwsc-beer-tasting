import { combineReducers } from 'redux';
import answersReducer from './reducers/answers';
import authReducer from './reducers/auth/reducer';
import eventsReducer from './reducers/events';
import resultsReducer from './reducers/results';

const rootReducer = combineReducers({
    auth: authReducer,
    events: eventsReducer,
    answers: answersReducer,
    results: resultsReducer
});
export default rootReducer;