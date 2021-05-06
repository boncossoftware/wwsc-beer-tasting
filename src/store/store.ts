import { createStore, applyMiddleware, AnyAction} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from "./reducer";
import { EVENT_MODIFIED_EVENT, listenChange } from './reducers/events';
import {initializeFirebaseApp, getCurrentUser} from './firebase'; //Setup firebase.

const composedEnhancers = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(rootReducer, composedEnhancers);
initializeFirebaseApp();

//Add event listener.
var listeningModifiedEvent = false;
if (window && !listeningModifiedEvent) {
    listeningModifiedEvent = true;
    window.addEventListener(EVENT_MODIFIED_EVENT,  (windowEvent) => {
        const event = (windowEvent as CustomEvent).detail;
        store.dispatch(listenChange(event));
        
    });
}

export default store;