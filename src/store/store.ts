import { createStore, applyMiddleware, AnyAction} from 'redux';
import thunkMiddleware, {ThunkDispatch} from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer, { RootState, StoreError } from "./reducer";
import { EVENT_MODIFIED_EVENT, listenChange } from './reducers/events';
import {initializeFirebaseApp} from './firebase'; //Setup firebase.
import { TastingEvent } from './reducers/events/reducer';

initializeFirebaseApp();

const composedEnhancers = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(rootReducer, composedEnhancers);

const asyncDispatch = (store.dispatch as ThunkDispatch<RootState, StoreError, AnyAction>);

//Add event listener.
var listeningModifiedEvent = false;
if (window && !listeningModifiedEvent) {
    listeningModifiedEvent = true;
    window.addEventListener(EVENT_MODIFIED_EVENT,  (windowEvent) => {
        const event = (windowEvent as CustomEvent).detail as TastingEvent;

        asyncDispatch( listenChange(event) );
        
    });
}

export default store;