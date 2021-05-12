import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, Switch, Route, Redirect, useRouteMatch} from "react-router";
import { NavLink } from "react-router-dom";
import { events } from "../../store";
import Beers from "../Beers";
import Tasters from "../Tasters";
import Tasting from '../Tasting';
import Venue from "../Venue";

const EventDetails = () => {    
    
    const {id} = useParams();
    const history = useHistory();
    const { path,url } = useRouteMatch();
    const dispatch = useDispatch();
    const user = useSelector( s => s?.auth?.user );
    const loading = useSelector( s => s?.events?.itemsLoading[id] );
    const error = useSelector( s => s?.events?.itemsError[id] );
    const item = useSelector( s => s?.events?.items?.find( i => i.id === id ) );
    const canEdit = (item?.owner === user?.uid);
    const activeSection = history.location.pathname.replace(url,'');

    useEffect( () => {
        dispatch( events.loadItem(id) );
    }, [dispatch, id] );

    const handleBackToEvents = () => {
        history.push('/');
    }

    const handleEditEvent = () => {
        history.push(`${url}${activeSection}/edit`);
    }
    return <>
        <button onClick={handleBackToEvents}>{"< Events"}</button>
        {item?.name}
        {canEdit && <button onClick={handleEditEvent}>{"Edit"}</button>}
        <hr/>
        {loading && <span>Loading...<br/></span>}
        {error && <span>{error.message}<br/></span>}
        <br/>
        <br/>
        <Switch >
            <Route path={`${path}/tasting`}>
                <Tasting baseURL={`${url}/tasting`}/>
            </Route>
            <Route path={`${path}/beers`}>
                <Beers />
            </Route>
            <Route path={`${path}/tasters`}>
                <Tasters />
            </Route>
            <Route path={`${path}/venue`} render={ () => <Venue />}/>
            <Redirect to={`${url}/tasting`} />
        </Switch>
        <br/>
        <hr/>
        <nav>
            <ul>
                <li><NavLink to={`${url}/tasting`}>Tasting</NavLink></li>
                <li><NavLink to={`${url}/beers`}>Beers</NavLink></li>
                <li><NavLink to={`${url}/tasters`}>Tasters</NavLink></li>
                <li><NavLink to={`${url}/venue`}>Venue</NavLink></li>
            </ul>
        </nav>
    </>
}
export default EventDetails;