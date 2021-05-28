import { Dialog } from "@material-ui/core";
import { ContactlessOutlined } from "@material-ui/icons";
import SlideUpTransition from "components/slide-up-transition";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router";
import BeerList from "../../components/beer-list";
import Rating from "../../components/rating";
import { events, answers } from '../../store';

const CONFIRM_MESSAGE = 'Discard changes made?';

const TastingDetails = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { id, round } = useParams();

    const roundIndex = round ? (round - 1) : -1;

    const user = useSelector(s => s?.auth?.user);
    const event = useSelector(s => s?.events?.items?.find(e => e.id === id));
    const eventLoading = useSelector(s => s?.events?.itemsLoading[id]);
    const answer = useSelector(s => s?.answers?.items?.find(e => e.id === id));
    const answerLoading = useSelector(s => s?.answers?.itemsLoading[id]);
    const updating = useSelector(s => s?.answers?.update.updating);
    const updated = useSelector(s => s?.answers?.update.updated);
    const updateError = useSelector(s => s?.answers?.update.error);

    const initialSelectedBeer = answer?.beers[roundIndex] || null;
    const initialSelectedRating = answer?.ratings[roundIndex] || null;
    const initialAsterisked = Boolean(answer?.asterisks[roundIndex] || null);
    const changesMade = answer?.changes[roundIndex] || 0;

    const [selectedBeer, setSelectedBeer] = useState(initialSelectedBeer);
    const [selectedRating, setSelectedRating] = useState(initialSelectedRating);
    const [selectedAsterisked, setSelectedAsterisked] = useState(initialAsterisked);
    const [open, setOpen] = useState(true);

    const changes = (
        initialSelectedBeer !== selectedBeer
        ||
        initialSelectedRating !== selectedRating
        ||
        initialAsterisked !== selectedAsterisked
    );

    const loading = eventLoading || answerLoading;
    const isBartender = (event?.bartender && (event.bartender === user?.email));

    //Load the event (if needed)
    useEffect(() => {
        dispatch(events.loadItem(id));
        dispatch(answers.loadItem(id));
    }, [dispatch, id]);

    //Update the current selected beer when answer changes.
    useEffect(() => {
        setSelectedRating(answer?.ratings[roundIndex]);
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
        }));
    }

    const handleClickBeer = (beer) => {
        setSelectedBeer(beer);
    }

    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
    }

    const handleAsteriskedChange = (event) => {
        const asterisked = event?.target?.checked;
        setSelectedAsterisked(asterisked);
    }

    const isOtherBeerSelected = (beer) => {
        return Boolean(answer?.beers.includes(beer));
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
        return event?.asterisksAllowed - total;
    }

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleCancel}
            onExited={handleExit}
            TransitionComponent={SlideUpTransition}
        >
            <button onClick={handleCancel}>{"Cancel"}</button>
            Round {round}
            <button
                onClick={handleSave}
                disabled={updating || !changes}
            >
                {"Save"}
            </button>
            <hr />
            {loading && <span>Loading...<br /></span>}
            {updating && <span>Updating...<br /></span>}
            {updateError && <span>{updateError.message}<br /></span>}
            <br />
            <h3>Select Beer</h3>
            <BeerList
                beers={event?.beers}
                isBeerDisabled={isOtherBeerSelected}
                isBeerSelected={b => selectedBeer === b}
                onClickBeer={handleClickBeer}
            />
            <p>Already selected beers are greyed out but can still be selected</p>

            {!isBartender && <>
                <h3>Rating</h3>
                <Rating rating={selectedRating} onChange={handleRatingChange} />
                <br /><br />

                <h3>Asterisk</h3>
                <input type="checkbox" checked={selectedAsterisked} onChange={handleAsteriskedChange} disabled={!selectedAsterisked && asterisksLeft() <= 0} />
                <span>{asterisksLeft()} Left</span>
                <br /><br />

                <h3>Round Changes Made</h3>
                <p>{changesMade}</p>
            </>}
        </Dialog>
    );
}
export default TastingDetails