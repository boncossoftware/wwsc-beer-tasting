import firebase, { QuerySnapshot } from 'store/firebase';
import "firebase/firestore";

import { eventFromDoc } from "./utils";
import { AnyAction, Dispatch } from "redux";
import { TastingEvent } from "./reducer";

export const EVENT_REMOVED_EVENT = "event-removed";
export const EVENT_MODIFIED_EVENT = 'event-modified';
export const ACTION_EVENTS_LISTEN_CHANGE = 'events/listen_change';
export const ACTION_EVENTS_LISTEN_REMOVE = "events/listen_remove";

//Subscribe to event changes to listen for allow edit from owner.
var _unsubscribe: (() => void) | undefined;

export function subscribe(userEmail: string) {
    unsubscribe();
    
    const relatedEventsCollectionRef = (
        firebase.firestore()
        .collection('events')
        .where('related', 'array-contains', userEmail)
    );

    _unsubscribe = relatedEventsCollectionRef.onSnapshot( (snapshot: QuerySnapshot) => {
        snapshot.docChanges().forEach( change => {
            const eventData = eventFromDoc(change.doc);
            let windowEvent;
            switch (change.type) {
              case "added":
              case "modified": {
                windowEvent = new CustomEvent(EVENT_MODIFIED_EVENT, {
                  detail: eventData,
                });
                break;
              }
              case "removed": {
                windowEvent = new CustomEvent(EVENT_REMOVED_EVENT, {
                  detail: change.doc.id,
                });
                break;
              }
            }
            if (windowEvent) {
                window.dispatchEvent(windowEvent);
            }
        });
    }, (error: any) => {
        console.log(error)
    });
}

export function unsubscribe() {
    (_unsubscribe && _unsubscribe());
    _unsubscribe = undefined;
}


export function listenChange(event: TastingEvent) {
    return async (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: ACTION_EVENTS_LISTEN_CHANGE, payload: event});
    }
}

export function listenRemove(eventId: string) {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: ACTION_EVENTS_LISTEN_REMOVE, payload: eventId });
  };
}