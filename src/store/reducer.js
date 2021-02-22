import { combineReducers } from 'redux';
import authReducer from './reducers/auth/reducer';
import eventsReducer from './reducers/events';

const rootReducer = combineReducers({
    auth: authReducer,
    events: eventsReducer
});
export default rootReducer;