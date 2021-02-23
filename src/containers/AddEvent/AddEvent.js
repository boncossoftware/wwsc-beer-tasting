import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import EventEditForm from "../../components/event-edit-form";
import {events} from '../../store';

const AddEvent = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const adding = useSelector( s => s?.events?.adding );
    const added = useSelector( s => s?.events?.add.added );
    const error = useSelector( s => s?.events?.add.error );
    const [event, setEvent] = useState({});

    useEffect( () => {
        if (added) {
            dispatch(events.resetAdd());
            history.push(`/event/${added.id}`);
        }
    }, [added, history, dispatch]);
    
    const handleCancel = () => {
        dispatch(events.resetAdd());
        history.push('/');
    }

    const handleSave = () => {
        dispatch(events.add(event));
    }

    const handleEventChange = (event) => {
        setEvent(event);
    }

    return <div>
        <button onClick={handleCancel} >Cancel</button>
        Add Event <br />
        <button disabled={adding} onClick={handleSave}>{adding ? 'Saving...' : 'Save'}</button>
        {error && <>{error.message}<br/></>}
        <EventEditForm event={event} onChange={handleEventChange} />
        <br />
    </div>;
}
export default AddEvent;