import { AnyAction, applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware, { ThunkDispatch } from "redux-thunk";
import rootReducer, { RootState, StoreError } from "./reducer";
import {
  ANSWER_MODIFIED_EVENT,
  listenChange as listenChangeAnswers,
} from "./reducers/answers";
import { TastingAnswer } from "./reducers/answers/reducer";
import {
  EVENT_MODIFIED_EVENT,
  listenChange as listenChangeEvents,
  listenRemove as listenRemoveEvents,
} from "./reducers/events";
import { EVENT_REMOVED_EVENT } from "./reducers/events/listen-change";
import { TastingEvent } from "./reducers/events/reducer";
import {
  RESULTS_MODIFIED_EVENT,
  listenChange as listenChangeResults,
} from "./reducers/results";
import { Result } from "./reducers/results/reducer";
import {
  USER_MODIFIED_EVENT,
  listenChange as listenChangeUsers,
} from "./reducers/users";
import { User } from "./reducers/users/reducer";

const composedEnhancers = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(rootReducer, composedEnhancers);

const asyncDispatch = store.dispatch as ThunkDispatch<
  RootState,
  StoreError,
  AnyAction
>;

//Add event listener.
let listeningModifiedEvent = false;
if (window && !listeningModifiedEvent) {
  listeningModifiedEvent = true;
  window.addEventListener(EVENT_MODIFIED_EVENT, (windowEvent) => {
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
  window.addEventListener(RESULTS_MODIFIED_EVENT, (windowEvent) => {
    const result = (windowEvent as CustomEvent).detail as Result;
    asyncDispatch(listenChangeResults(result));
  });
  window.addEventListener(USER_MODIFIED_EVENT, (windowEvent) => {
    const user = (windowEvent as CustomEvent).detail as User;
    asyncDispatch(listenChangeUsers(user));
  });
}

export default store;
