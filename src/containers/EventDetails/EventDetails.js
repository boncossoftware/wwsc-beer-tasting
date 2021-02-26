import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, Switch, Route, Redirect} from "react-router";
import { NavLink } from "react-router-dom";
import { events } from "../../store";
import Beers from "../Beers";
import Tasters from "../Tasters";
import Tasting from '../Tasting';
import Venue from "../Venue";

const EventDetails = () => {    
    const {id} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector( s => s?.auth?.user );
    const loading = useSelector( s => s?.events?.itemsLoading[id] );
    const error = useSelector( s => s?.events?.itemsError[id] );
    const item = useSelector( s => s?.events?.items?.find( i => i.id === id ) );
    
    const basePath = `/event/${id}`;
    const canEdit = (item?.owner === user?.uid);
    
    useEffect( () => {
        dispatch( events.loadItem(id) );
    }, [dispatch, id] );

    const handleBackToEvents = () => {
        history.push('/');
    }
    
    return <>
        {loading && <span>Loading..</span>}
        {error && <span>{error.message}</span>}
        
        <button onClick={handleBackToEvents}>{"< Events"}</button>
        {item?.name}
        {canEdit && <button onClick={handleBackToEvents}>{"Edit"}</button>}
        <br/><br/>
        <Switch >
            <Route path="/event/:eventID/tasting" render={ () => <Tasting /> }/>
            <Route path="/event/:eventID/beers" render={ () => <Beers />}/>
            <Route path="/event/:eventID/tasters" render={ () => <Tasters />}/>
            <Route path="/event/:eventID/venue" render={ () => <Venue />}/>
            <Redirect to={`${basePath}/tasting`} />
        </Switch>
        <br/>
        <nav>
            <ul>
                <li><NavLink to={`${basePath}/tasting`}>Tasting</NavLink></li>
                <li><NavLink to={`${basePath}/beers`}>Beers</NavLink></li>
                <li><NavLink to={`${basePath}/tasters`}>Tasters</NavLink></li>
                <li><NavLink to={`${basePath}/venue`}>Venue</NavLink></li>
            </ul>
        </nav>
    </>
}
export default EventDetails;