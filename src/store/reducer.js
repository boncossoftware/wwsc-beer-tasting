import { combineReducers } from 'redux';
import answersReducer from './reducers/answers';
import authReducer from './reducers/auth/reducer';
import eventsReducer from './reducers/events';

const rootReducer = combineReducers({
    auth: authReducer,
    events: eventsReducer,
    answers: answersReducer,
});
export default rootReducer;