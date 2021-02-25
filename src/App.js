import Events from './containers/Events/Events';



import { auth } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from './containers/Login';
import { useEffect } from 'react';
import AddEvent from './containers/AddEvent';
import EventDetails from './containers/EventDetails';



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
                    {!user && <Redirect to="/login" />}
                    <Route path="/" exact render={() => <Events />} />
                    <Route path="/event/add" exact render={ () => <AddEvent /> } />
                    <Route path="/event/:id" render={ () => <EventDetails /> } />
                </Switch>
            }
        </div>

    );
}

export default App;
