import { Dialog } from "@material-ui/core";
import AppBar from "components/app-bar";
import ErrorMessage from "components/error-message";
import SlideUpTransition from "components/slide-up-transition";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router";
import { StoreError, UserInfo } from "store/reducer";
import { TastingAnswer } from "store/reducers/answers/reducer";
import { TastingEvent } from "store/reducers/events/reducer";
import { events, answers, RootState } from '../../store';
import { 
    Container,
    CancelButton,
    CircularProgress,
    UpdateButton,
    InnerContainer,
    RatingField,
    AsteriskedField,
    BeerSelectionField,
    ChangesMadeField
} from './TastingDetails.styles';

const CONFIRM_MESSAGE = 'Discard changes made?';
type TastingDetailsParams = {id?: string, round?:string};

const TastingDetails = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { id='', round } = useParams<TastingDetailsParams>();

    const roundIndex = round ? (parseInt(round) - 1) : -1;

    const user = useSelector<RootState, UserInfo|null>(s => s?.auth?.user);
    const event = useSelector<RootState, TastingEvent|undefined>(
        s => s?.events?.items?.find(e => e.id === id)
    );
    const eventLoading = useSelector<RootState, boolean>(s => s?.events?.itemsLoading[id]);
    const eventError = useSelector<RootState, StoreError>(s => s?.events?.itemsError[id]);  
    const answer = useSelector<RootState, TastingAnswer | undefined>((s) =>
      s?.answers?.items?.find((e) => e.id === user?.email)
    );
    const answerLoading = useSelector<RootState, boolean>(
      (s) => s?.answers?.itemsLoading[user?.email ?? '']
    );
    const updating = useSelector<RootState, boolean>(s => s?.answers?.update.updating);
    const updated = useSelector<RootState, TastingAnswer[]|null>(s => s?.answers?.update.updated);
    const answerError = useSelector<RootState, StoreError|null>(s => s?.answers?.update.error);
    
    const initialSelectedBeer = (answer?.beers||[])[roundIndex] || null;
    const initialSelectedRating = (answer?.ratings||[])[roundIndex] || null;
    const initialAsterisked = Boolean((answer?.asterisks||[])[roundIndex] || null);
    const changesMade = (answer?.changes||[])[roundIndex] || 0;

    const [selectedBeer, setSelectedBeer] = useState(initialSelectedBeer);
    const [selectedRating, setSelectedRating] = useState(initialSelectedRating);
    const [selectedAsterisked, setSelectedAsterisked] = useState(initialAsterisked);
    const [open, setOpen] = useState<boolean>(true);

    const changes = (
        initialSelectedBeer !== selectedBeer
        ||
        initialSelectedRating !== selectedRating
        ||
        initialAsterisked !== selectedAsterisked
    );

    const loading = (eventLoading && !event) || (answerLoading && !answer);
    const error = eventError || answerError;
    const isBartender = (event?.bartender && (event.bartender === user?.email));

    //Load the event (if needed)
    useEffect(() => {
        dispatch(events.loadItem(id));
        dispatch(answers.loadItem(id));
    }, [dispatch, id]);

    //Update the current selected beer when answer changes.
    useEffect(() => {
        setSelectedRating((answer?.ratings||[])[roundIndex]);
    }, [answer, roundIndex, setSelectedRating])

    useEffect(() => {
        setSelectedBeer(initialSelectedBeer);
        setSelectedRating(initialSelectedRating);
        setSelectedAsterisked(initialAsterisked);
    }, [
        answer,
        roundIndex,
        setSelectedBeer,
        initialSelectedBeer,
        setSelectedRating,
        initialSelectedRating,
        setSelectedAsterisked,
        initialAsterisked
    ])

    //Go back once updated.
    useEffect(() => {
        if (updated) {
            dispatch(answers.resetUpdate());
            setOpen(false);
        }
    }, [updated, history, dispatch, id]);

    const handleCancel = () => {
        if (changes && !window.confirm(CONFIRM_MESSAGE)) {
            return;
        }
        dispatch(events.resetUpdate());
        setOpen(false);
    }

    const handleExit = () => {
        history.push(`/event/${id}/tasting`);
    }

    const handleSave = () => {
        //Save the data.
        dispatch(answers.update(id, {
            beers: answer?.beers?.map((b, i) => (i === roundIndex) ? selectedBeer : b),
            ratings: answer?.ratings?.map((r, i) => (i === roundIndex) ? selectedRating : r),
            asterisks: answer?.asterisks?.map((a, i) => (i === roundIndex) ? selectedAsterisked : a),
            changes: answer?.changes?.map((a, i) => (i === roundIndex) ? (a + 1) : a)
        } as TastingAnswer));
    }

    const handleClickBeer = (beer:string|null) => {
        setSelectedBeer(beer);
    }

    const handleRatingChange = (rating: number|null) => {
        setSelectedRating(rating);
    }

    const handleAsteriskedChange = (event: ChangeEvent<HTMLInputElement>) => {
        const asterisked = event?.target?.checked;
        setSelectedAsterisked(asterisked);
    }

    const beerPreselectedIndex = (beer: string|null) => {
        const index = answer?.beers?.indexOf(beer);
        const isBeerOfRound = (beer === initialSelectedBeer);
        const notFound = (index === undefined);
        return (isBeerOfRound || notFound) ? -1 : index!;
    }

    const isBeerSelected =  (beer: string|null) => {
        return Boolean(selectedBeer === beer);
    }

    const asterisksLeft = () => {
        let total = 0;
        answer?.asterisks?.forEach((a, i) => {
            if (i === roundIndex) {
                total += (selectedAsterisked === true) ? 1 : 0;
            }
            else {
                total += (a === true) ? 1 : 0;
            }
        });
        return (event?.asterisksAllowed||0) - total;
    }

    return (
      <Container id="tasting-details">
        <Dialog
          fullScreen
          open={open}
          onClose={handleCancel}
          TransitionProps={{ onExited: handleExit }}
          TransitionComponent={SlideUpTransition}
          scroll="paper"
        >
          <AppBar
            renderLeftComponent={() => <CancelButton onClick={handleCancel} />}
            title={`Round ${round}`}
            renderRightComponent={() => (
              <UpdateButton isSaving={updating} onClick={handleSave} />
            )}
          />
          <InnerContainer>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                {error && <ErrorMessage error={error} />}
                <BeerSelectionField
                  beers={event?.beers as any[]}
                  beerPreselectedIndex={beerPreselectedIndex}
                  isBeerSelected={isBeerSelected}
                  onClickBeer={handleClickBeer}
                />
                {!isBartender && (
                  <>
                    <RatingField
                      rating={selectedRating}
                      onChange={handleRatingChange}
                    />
                    <AsteriskedField
                      selected={selectedAsterisked}
                      onChange={handleAsteriskedChange}
                      disabled={!selectedAsterisked && asterisksLeft() <= 0}
                      asterisksLeft={asterisksLeft()}
                    />
                    <ChangesMadeField changesMade={changesMade} />
                  </>
                )}
              </>
            )}
          </InnerContainer>
        </Dialog>
      </Container>
    );
}
export default TastingDetails