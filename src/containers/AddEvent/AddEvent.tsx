import { Dialog } from "@material-ui/core";
import { MouseEventHandler, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import EventEditForm, { EventEditFormChangeHandler, DEFAULT_EVENT } from "../../components/event-edit-form";
import {events, RootState, StoreError} from '../../store';
import SlideUpTransition from 'components/slide-up-transition';
import { TastingEvent } from "store/reducers/events/reducer";
import AppBar from "components/app-bar";
import ErrorMessage from "components/error-message";
import {CancelButton, AddButton} from './AddEvent.styles';

const AddEvent = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const adding = useSelector<RootState, boolean>( s => s?.events?.add.adding );
    const added = useSelector<RootState, TastingEvent|null>( s => s?.events?.add.added );
    const error = useSelector<RootState, StoreError|null>( s => s?.events?.add.error );
    const [event, setEvent] = useState<TastingEvent>(DEFAULT_EVENT);
    const [open, setOpen] = useState<boolean>(true);

    useEffect( () => {
        if (added) {
            dispatch(events.resetAdd());
            history.push(`/event/${added.id}/`);
        }
    }, [added, history, dispatch]);
    
    const handleCancel = () => {
        dispatch(events.resetAdd());
        setOpen(false);
    }

    const handleSave: MouseEventHandler = () => {
        if (!event) return;
        dispatch(events.add(event));
    }

    const handleEventChange: EventEditFormChangeHandler = (event) => {
        setEvent(event);
    }

    const handleExit = () => {
        history.push('/');
    }

    return <div id="add-event">
        <Dialog 
            fullScreen 
            open={open} 
            onClose={handleCancel}
            onExited={handleExit} 
            TransitionComponent={SlideUpTransition}
        >
            <AppBar 
                renderLeftComponent={ () => 
                    <CancelButton onClick={handleCancel} />
                } 
                title="Add Event"
                renderRightComponent={ () =>
                    <AddButton isSaving={adding} onClick={handleSave} />
                } 
            />
            {error && 
                <ErrorMessage error={error} />
            }
            <EventEditForm event={event} onChange={handleEventChange} />
        </Dialog>
    </div>;
}
export default AddEvent;