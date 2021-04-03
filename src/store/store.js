import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from "./reducer";
import { EVENT_MODIFIED_EVENT, listenChange } from './reducers/events';

const composedEnhancers = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(rootReducer, composedEnhancers);

//Add event listener.
var listeningModifiedEvent = false;
if (window && !listeningModifiedEvent) {
    listeningModifiedEvent = true;
    window.addEventListener(EVENT_MODIFIED_EVENT,  (windowEvent) => {
        const event = windowEvent.detail;
        store.dispatch(listenChange(event));
    });
}

export default store;