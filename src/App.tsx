import Events from "./containers/Events/Events";
import CssBaseline from "@material-ui/core/CssBaseline";
import { auth, RootState } from "./store";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Login from "./containers/Login";
import { useEffect } from "react";
import AddEvent from "./containers/AddEvent";
import EventDetails from "./containers/EventDetails";
import TastingDetails from "./containers/TastingDetails";
import EditEvent from "./containers/EditEvent";
import Forgot from "./containers/Forgot";
import Reset from "./containers/Reset";
import CreateAccount from "./containers/CreateAccount/CreateAccount";
import { UserInfo } from "store/reducer";
import FullPageCircularProgress from "components/full-page-circular-progress";
import { Fade } from "@material-ui/core";

function App() {
  const dispatch = useDispatch();
  const initialized = useSelector<RootState, boolean>(
    (s) => s?.auth?.initialized
  );
  const user = useSelector<RootState, UserInfo | null>((s) => s?.auth?.user);

  //Intialize the auth state.
  useEffect(() => {
    dispatch(auth.initialize());
  }, [dispatch]);

  return (
    <div className="App">
      <CssBaseline />
      <Fade in={initialized}>
        <div>
          {!initialized && <FullPageCircularProgress />}
          {initialized && (
            <Switch>
              <Route path="/login">
                {" "}
                <Login />{" "}
              </Route>
              <Route path="/forgot">
                {" "}
                <Forgot />{" "}
              </Route>
              <Route path="/reset">
                {" "}
                <Reset />{" "}
              </Route>
              <Route path="/create-account">
                {" "}
                <CreateAccount />{" "}
              </Route>

              {/* following paths are only accessible for authenticated users */}
              {!user && <Redirect to="/login" />}

              <Route path="/(event/add)?" exact>
                <Route path="/">
                  {" "}
                  <Events />{" "}
                </Route>
                {/* Shown as a modal */}
                <Route path="/event/add">
                  {" "}
                  <AddEvent />{" "}
                </Route>
              </Route>

              <Route path="/event/:id/:section?/(edit)?">
                <Route path="/event/:id">
                  <EventDetails />
                </Route>
                <Route path="/event/:id/:section/edit">
                  <EditEvent />
                </Route>
                <Route path="/event/:id/tasting/round/:round">
                  <TastingDetails />
                </Route>
              </Route>
              <Redirect to="/login" />
            </Switch>
          )}
        </div>
      </Fade>
    </div>
  );
}

export default App;
