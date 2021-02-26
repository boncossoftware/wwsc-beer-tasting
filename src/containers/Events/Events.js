import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {auth, events} from '../../store';

const Events = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector( s => s?.events?.loading );
    const items = useSelector( s => s?.events?.items );
    const error = useSelector( s => s?.events?.error );

    useEffect( () => {
        dispatch(events.load());
    }, [dispatch] );

    const handleLogout = () => {
        dispatch(auth.logout());
    }

    const handleAddEvent = () => {
        history.push('/event/add');
    }
    
    const handleClickEvent = (item) => () => {
        history.push(`/event/${item.id}`);
    }

    return <div> 
        <button onClick={handleLogout} >Logout</button>
        events 
        <button onClick={handleAddEvent}>Add</button>
        <br/>
        {loading && <>{"loading..."} <br/> </> }
        {items && items.map( (item, index) => 
            <div key={index} onClick={ handleClickEvent(item) }>
                <span >{item.name}</span><br/>
            </div>
        )} 
        {items?.length === 0 && <>No events.<br/></>}
        {error && error.message}
    </div>;
}
export default Events;