import { createStore, applyMiddleware, AnyAction } from "redux";
import thunkMiddleware, { ThunkDispatch } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer, { RootState, StoreError } from "./reducer";
import {
  EVENT_MODIFIED_EVENT,
  listenChange as listenChangeEvents,
  listenRemove as listenRemoveEvents,
} from "./reducers/events";
import { listenChange as listenChangeUsers } from "./reducers/users";
import { TastingEvent } from "./reducers/events/reducer";
import {
  ANSWER_MODIFIED_EVENT,
  listenChange as listenChangeAnswers,
} from "./reducers/answers";
import { TastingAnswer } from "./reducers/answers/reducer";
import { EVENT_REMOVED_EVENT } from "./reducers/events/listen-change";
import { USER_MODIFIED_EVENT } from "./reducers/users";
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
  window.addEventListener(USER_MODIFIED_EVENT, (windowEvent) => {
    const user = (windowEvent as CustomEvent).detail as User;
    asyncDispatch(listenChangeUsers(user));
  });
}

export default store;
