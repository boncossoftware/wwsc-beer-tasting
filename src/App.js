import Events from './containers/Events/Events';

import { auth } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from './containers/Login';
import { useEffect } from 'react';
import AddEvent from './containers/AddEvent';
import EventDetails from './containers/EventDetails';
import TastingDetails from './containers/TastingDetails';
import EditEvent from './containers/EditEvent';
import Forgot from './containers/Forgot';
import Reset from './containers/Reset';
import CreateAccount from './containers/CreateAccount/CreateAccount';

function App() {
    const dispatch = useDispatch();
    const initialized = useSelector( s => s?.auth?.initialized );
    const user = useSelector( s => s?.auth?.user );

    //Intialize the auth state.
    useEffect( () => {
        dispatch(auth.initialize());
    }, [dispatch] );

    return (
        <div className="App">
            {!initialized && "loading..."}
            {initialized &&
                <Switch>
                    <Route path="/login" exact render={() => <Login />} />
                    <Route path="/forgot" exact render={() => <Forgot />} />
                    <Route path="/reset" exact render={() => <Reset />} />
                    <Route path="/create-account" exact render={() => <CreateAccount />} />
                    {!user && <Redirect to="/login" />}
                    <Route path="/" exact render={() => <Events />} />
                    <Route path="/event/add" exact render={ () => <AddEvent /> } />
                    <Route path="/event/:id/edit" exact render={ () => <EditEvent /> } />
                    <Route path="/event/:id/:section?" exact render={ () => <EventDetails /> } />
                    <Route path="/event/:id/tasting/round/:round"  render={ () => <TastingDetails /> } />
                </Switch>
            }
        </div>
    );
}

export default App;
