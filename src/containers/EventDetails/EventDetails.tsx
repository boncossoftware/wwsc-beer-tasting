import AppBar from "components/app-bar";
import ErrorMessage from "components/error-message";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, Switch, Route, Redirect, useRouteMatch } from "react-router";
import { StoreError, UserInfo } from "store/reducer";
import { TastingEvent } from "store/reducers/events/reducer";
import { events, RootState } from "../../store";
import Beers from "../Beers";
import Tasters from "../Tasters";
import Tasting from '../Tasting';
import Venue from "../Venue";
import {
  Container,
  BackButton,
  BeersBarItem,
  BottomNavigationBar,
  CircularProgress,
  EditButton,
  TastersBarItem,
  TastingBarItem,
  VenueBarItem,
  ResultsBarItem
} from './EventDetails.styles';
import Results from "containers/Results";

const getBaseURL = (routeMatchURL: string) => {
  return routeMatchURL.endsWith('/') ? routeMatchURL.slice(0, routeMatchURL.length - 1) : routeMatchURL;
}

const getActiveSection = (routeMatchURL: string) => {
  const fullURL = window.location.pathname;
  return fullURL.replace(routeMatchURL, '').replace('/', '');
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const dispatch = useDispatch();
  const user = useSelector<RootState, UserInfo | null>(s => s?.auth?.user);
  const loading = useSelector<RootState, boolean>(s => s?.events?.itemsLoading[id]);
  const error = useSelector<RootState, StoreError | null>(s => s?.events?.itemsError[id]);
  const item = useSelector<RootState, TastingEvent | undefined>(s => s?.events?.items?.find(i => i.id === id));
  const canEdit = (item?.owner === user?.email);
  const baseURL = getBaseURL(url);
  const activeSection = getActiveSection(url);

  useEffect(() => {
    dispatch(events.loadItem(id));
  }, [id, dispatch]);

  const handleBackToEvents = () => {
    history.push('/');
  }

  const handleEditEvent = () => {
    history.push(`${baseURL}/${activeSection}/edit`);
  }

  const handleChangeActiveSection = (_: object, section: any) => {
    if (section === activeSection) return; //Already at section.
    history.push(`${baseURL}/${section}`);

  }

  const displayLoading = loading && !item;
  return (
    <Container data-testid="event-details">
      <AppBar
        renderLeftComponent={() => (
          <BackButton onClick={handleBackToEvents} />
        )}
        title={item?.name ?? "Event"}
        renderRightComponent={() =>
          canEdit ? <EditButton onClick={handleEditEvent} /> : null
        }
      />
      <div>
        {displayLoading ? (
          <CircularProgress />
        ) : (
          <>
            {error && <ErrorMessage error={error} />}
            <Switch>
              <Route path={`${path}/tasting`}>
                <Tasting baseURL={`${baseURL}/tasting`} />
              </Route>
              <Route path={`${path}/results`}>
                <Results />
              </Route>
              <Route path={`${path}/beers`}>
                <Beers />
              </Route>
              <Route path={`${path}/tasters`}>
                <Tasters />
              </Route>
              <Route path={`${path}/venue`}>
                <Venue />
              </Route>
              <Redirect to={`${baseURL}/tasting`} />
            </Switch>
          </>
        )}
      </div>
      <BottomNavigationBar
        value={activeSection}
        onChange={handleChangeActiveSection}
      >
        <TastingBarItem value={"tasting"} />
        <ResultsBarItem value={"results"} />
        <BeersBarItem value={"beers"} />
        <TastersBarItem value={"tasters"} />
        <VenueBarItem value={"venue"} />
      </BottomNavigationBar>
    </Container>
  );
}
export default EventDetails;