import { createStore, applyMiddleware, AnyAction} from 'redux';
import thunkMiddleware, {ThunkDispatch} from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer, { RootState, StoreError } from "./reducer";
import {
  EVENT_MODIFIED_EVENT,
  listenChange as listenChangeEvents,
  listenRemove as listenRemoveEvents,
} from "./reducers/events";
import { TastingEvent } from './reducers/events/reducer';
import {ANSWER_MODIFIED_EVENT, listenChange as listenChangeAnswers} from './reducers/answers';
import { TastingAnswer } from './reducers/answers/reducer';
import { EVENT_REMOVED_EVENT } from './reducers/events/listen-change';

const composedEnhancers = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(rootReducer, composedEnhancers);

const asyncDispatch = (store.dispatch as ThunkDispatch<RootState, StoreError, AnyAction>);

//Add event listener.
var listeningModifiedEvent = false;
if (window && !listeningModifiedEvent) {
    listeningModifiedEvent = true;
    window.addEventListener(EVENT_MODIFIED_EVENT,  (windowEvent) => {
        const event = (windowEvent as CustomEvent).detail as TastingEvent;
        asyncDispatch(listenChangeEvents(event)); 
    });
    window.addEventListener(EVENT_REMOVED_EVENT, (windowEvent) => {
      const eventId = (windowEvent as CustomEvent).detail as string;
      asyncDispatch(listenRemoveEvents(eventId));
    });
    window.addEventListener(ANSWER_MODIFIED_EVENT, (windowEvent) => {
      const answer = (windowEvent as CustomEvent).detail as TastingAnswer;

      asyncDispatch(listenChangeAnswers(answer));
    });
}

export default store;