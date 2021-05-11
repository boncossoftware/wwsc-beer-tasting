import { Dialog } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import EventEditForm from "../../components/event-edit-form";
import {events} from '../../store';
import SlideUpTransition from 'components/slide-up-transition';

const AddEvent = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const adding = useSelector( s => s?.events?.add.adding );
    const added = useSelector( s => s?.events?.add.added );
    const error = useSelector( s => s?.events?.add.error );
    const [event, setEvent] = useState({});
    const [open, setOpen] = useState(true);

    useEffect( () => {
        if (added) {
            dispatch(events.resetAdd());
            history.push(`/event/${added.id}`);
        }
    }, [added, history, dispatch]);
    
    const handleCancel = () => {
        dispatch(events.resetAdd());
        setOpen(false);
    }

    const handleSave = () => {
        dispatch(events.add(event));
    }

    const handleEventChange = (event) => {
        setEvent(event);
    }

    const handleExit = () => {
        history.push('/');
    }

    return <div>
        <Dialog 
            fullScreen 
            open={open} 
            onClose={handleCancel}
            onExited={handleExit} 
            TransitionComponent={SlideUpTransition}
        >
        <button onClick={handleCancel} >Cancel</button>
        Add Event
        <button disabled={adding} onClick={handleSave}>{adding ? 'Saving...' : 'Save'}</button>
        <hr/>
        {error && <>{error.message}<br/></>}
        <EventEditForm event={event} onChange={handleEventChange} />
        <br />
        </Dialog>
    </div>;
}
export default AddEvent;