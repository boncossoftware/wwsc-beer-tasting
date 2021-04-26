import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import EventEditForm from "../../components/event-edit-form";
import {events} from '../../store';

const EditEvent = () => {
    const {id} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const updating = useSelector( s => s?.events?.updating );
    const updated = useSelector( s => s?.events?.update.updated );
    const error = useSelector( s => s?.events?.update.error );
    const loading = useSelector( s => s?.events?.itemsLoading[id] );
    const item = useSelector( s => s?.events?.items?.find( i => i.id === id ) );
    const [event, setEvent] = useState(item);

    useEffect( () => {
        dispatch( events.loadItem(id) );
    }, [dispatch, id] );

    useEffect( () => {
        if (loading === false && item) {
            setEvent(item);
        }
    }, [loading, item, setEvent] );

    useEffect( () => {
        if (updated) {
            dispatch(events.resetUpdate());
            history.push(`/event/${id}`);
        }
    }, [updated, history, dispatch]);
    
    const handleCancel = () => {
        dispatch(events.resetUpdate());
        history.push(`/event/${id}`);
    }

    const handleSave = () => {
        if (window.confirm('All answers and results will be cleared. Are you sure?')) {
            dispatch(events.update(event));
        }
    }

    const handleEventChange = (event) => {
        setEvent(event);
    }

    return <div>
        <button onClick={handleCancel} >Cancel</button>
        Edit Event
        <button disabled={updating} onClick={handleSave}>{updating ? 'Updating...' : 'Save'}</button>
        <hr/>
        <p>Warning: Editing an event clears all answers and results.</p>
        {loading && <span>Loading...<br/></span>}
        {error && <>{error.message}<br/></>}
        {event && <EventEditForm event={event} onChange={handleEventChange} />}
        <br />
    </div>;
}
export default EditEvent;