import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router";
import Rating from "../../components/rating";
import { events, answers} from '../../store';

const CONFIRM_MESSAGE = 'Discard changes made?';

const TastingDetails = () => {   
    const history = useHistory();
    const dispatch = useDispatch();
    const {id, round} = useParams(); 
    
    const roundIndex = round ? (round - 1) : -1;

    const event = useSelector( s => s?.events?.items?.find( e => e.id === id));
    const eventLoading = useSelector( s => s?.events?.itemsLoading[id] );
    const answer = useSelector( s => s?.answers?.items?.find( e => e.id === id));
    const answerLoading = useSelector( s => s?.answers?.itemsLoading[id] );
    const updating = useSelector( s => s?.answers?.update.updating);
    const updated = useSelector( s => s?.answers?.update.updated);
    const updateError = useSelector( s => s?.answers?.update.error);
    
    const initialSelectedBeer = answer?.beers[roundIndex] || null;
    const initialSelectedRating = answer?.ratings[roundIndex] || null;
    const initialAsterisked = Boolean(answer?.asterisks[roundIndex] || null);
    const changesMade = answer?.changes[roundIndex] || 0;

    const [selectedBeer, setSelectedBeer] = useState(initialSelectedBeer);
    const [selectedRating, setSelectedRating] = useState(initialSelectedRating);
    const [selectedAsterisked, setSelectedAsterisked] = useState(initialAsterisked);

    const changes = (
        initialSelectedBeer !== selectedBeer
        ||
        initialSelectedRating !== selectedRating
        ||
        initialAsterisked !== selectedAsterisked
    );
    const loading = eventLoading || answerLoading;

    //Load the event (if needed)
    useEffect( () => {
        dispatch( events.loadItem(id) );
        dispatch( answers.loadItem(id) );
    }, [dispatch, id] );

    //Update the current selected beer when answer changes.
    useEffect( () => {
        setSelectedRating(answer?.ratings[roundIndex]);
    }, [answer, roundIndex, setSelectedRating])

    useEffect( () => {
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
    useEffect( () => {
        if (updated) {
            dispatch(answers.resetUpdate());
            history.push(`/event/${id}/tasting`);
        }
    }, [updated, history, dispatch, id]);
    
    const handleCancel = () => {
        if (changes && !window.confirm(CONFIRM_MESSAGE) ) {
            return;
        }
        history.goBack();
    }

    const handleSave = () => {
        //Save the data.
        dispatch(answers.update(id, {
            beers: answer?.beers?.map( (b, i) => (i === roundIndex) ? selectedBeer : b ),
            ratings: answer?.ratings?.map( (r, i) => (i === roundIndex) ? selectedRating : r ),
            asterisks: answer?.asterisks?.map( (a, i) => (i === roundIndex) ? selectedAsterisked : a ),
            changes: answer?.changes?.map( (a, i) => (i === roundIndex) ? (a + 1) : a )
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
        answer?.asterisks?.forEach( (a, i) => {
            if (i === roundIndex) {
                total += (selectedAsterisked === true) ? 1 : 0;
            }
            else {
                total += (a === true) ? 1 : 0;
            }
        });
        return event?.asterisksAllowed - total;
    }

    return <>
        <button onClick={handleCancel}>{"Cancel"}</button>
        Round {round}
        <button 
            onClick={handleSave} 
            disabled={updating || !changes} 
        >
            {"Save"}
        </button>
        <hr/>
        {loading && <span>Loading...<br/></span>}
        {updating && <span>Updating...<br/></span>}
        {updateError && <span>{updateError.message}<br/></span>}
        <br/>
        <h3>Select Beer</h3>
        {(event?.beers || [])?.map( (beer, i) => 
            <div key={i} onClick={ _ => handleClickBeer(beer)}>
                { isOtherBeerSelected(beer) ? 
                    <span style={{color: "gray"}}><i>{beer}</i></span>
                    :
                    <span>{beer}</span>                   
                }
                {selectedBeer === beer && <span style={{float:'right'}}>&#10003;</span>}
                <br/>
                <hr/>
            </div>
        )}
        
        <p>Already selected beers are greyed out but can still be selected</p>

        <h3>Rating</h3>
        <Rating rating={selectedRating} onChange={handleRatingChange} />
        <br/><br/>
        
        <h3>Asterisk</h3>
        <input type="checkbox" checked={selectedAsterisked} onChange={handleAsteriskedChange} disabled={ !selectedAsterisked && asterisksLeft() <= 0} />
        <span>{asterisksLeft()} Left</span>
        <br/><br/>
    
        <h3>Round Changes Made</h3>
        <p>{ changesMade }</p>
    </>;
}
export default TastingDetails