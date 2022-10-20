import { Dialog } from "@material-ui/core";
import AppBar from "components/app-bar";
import ErrorMessage from "components/error-message";
import SlideUpTransition from "components/slide-up-transition";
import {
  CancelButton,
  UpdateButton,
  CircularProgress,
  InformationMessage,
} from "containers/EditEvent/EditEvent.styles";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, useRouteMatch } from "react-router";
import { TastingEvent } from "store/reducers/events/reducer";
import EventEditForm, {
  EventEditFormChangeHandler,
} from "../../components/event-edit-form";
import { events, RootState, StoreError } from "../../store";

const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const { url: baseURL } = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const updating = useSelector<RootState, boolean>(
    (s) => s?.events?.update.updating
  );
  const updated = useSelector<RootState, TastingEvent | null>(
    (s) => s?.events?.update.updated
  );
  const error = useSelector<RootState, StoreError | null>(
    (s) => s?.events?.update.error
  );
  const loading = useSelector<RootState, boolean>(
    (s) => s?.events?.itemsLoading[id]
  );
  const item = useSelector<RootState, TastingEvent | undefined>((s) =>
    s?.events?.items?.find((i) => i.id === id)
  );
  const [event, setEvent] = useState<TastingEvent | undefined>(item);
  const [open, setOpen] = useState<boolean>(true);
  const backURL = baseURL.replace("/edit", "");

  useEffect(() => {
    dispatch(events.loadItem(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (loading === false && item) {
      setEvent(item);
    }
  }, [loading, item, setEvent]);

  const handleCancel = useCallback(() => {
    dispatch(events.resetUpdate());
    setOpen(false);
  }, [dispatch]);

  useEffect(() => {
    if (updated) {
      handleCancel();
    }
  }, [updated, history, dispatch, handleCancel]);

  const handleSave = () => {
    if (
      event &&
      window.confirm("All answers and results will be cleared. Are you sure?")
    ) {
      dispatch(events.update(event));
    }
  };

  const handleExit = () => {
    history.push(backURL);
  };

  const handleEventChange: EventEditFormChangeHandler = (event) => {
    setEvent(event);
  };

  return (
    <div id="edit-event">
      <Dialog
        fullScreen
        open={open}
        onClose={handleCancel}
        onExited={handleExit}
        TransitionComponent={SlideUpTransition}
      >
        <AppBar
          renderLeftComponent={() => <CancelButton onClick={handleCancel} />}
          title="Edit Event"
          renderRightComponent={() => (
            <UpdateButton isSaving={updating} onClick={handleSave} />
          )}
        />
        <InformationMessage>
          Warning: Editing an event clears all answers and results.
        </InformationMessage>
        {error && <ErrorMessage error={error} />}
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {event && (
              <EventEditForm event={event} onChange={handleEventChange} />
            )}
          </>
        )}
      </Dialog>
    </div>
  );
};
export default EditEvent;
