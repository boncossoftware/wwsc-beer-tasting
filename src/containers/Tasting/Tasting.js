import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import TastingAnswers from "../../components/tasting-answers";
import TastingResults from "../../components/tasting-results";
import { answers, events, results } from "../../store";

const Tasting = () => {    
    const {eventID} = useParams();
    const dispatch = useDispatch();
    const user = useSelector( s => s?.auth?.user);
    
    const answersLoading = useSelector( s => s?.answers?.itemsLoading[eventID] );
    const answersError = useSelector( s => s?.answers?.itemsError[eventID] );
    const userAnswers = useSelector( s => s?.answers?.items?.find( i => i.id === eventID ) );

    const resultsLoading = useSelector( s => s?.results?.itemsLoading[eventID] );
    const resultsError = useSelector( s => s?.results?.itemsError[eventID] );
    const tastingResults = useSelector( s => s?.results?.items?.find( i => i.id === eventID ) );
    
    const {
        beers, 
        bartender, 
        owner,
        editingAllowed=false
    } = useSelector( s => s?.events?.items?.find( i => i.id === eventID ) ) || {};
    
    const isBartender = bartender === user?.email;
    const canEdit = (owner === user?.uid);
    const resultsAvailable = Boolean(tastingResults?.lastUpdated);

    useEffect( () => {
        dispatch( answers.loadItem(eventID) );
        dispatch( results.loadItem(eventID) );
    }, [dispatch, eventID] );

    const handleAllowEditing = () => {
        const message = editingAllowed ? 
            'Are you sure you want to stop editing answers?'
            :
            'Are you sure you want to allow editing answers?'
        ;
        if (window.confirm(message)) {
            dispatch( events.allowEdit(eventID, !editingAllowed) );
        } 
    }

    const handleClickItemAtIndex = (index) => {

    }

    const handleCalculateResults = () => {
        dispatch( results.calculate(eventID) );
    }

    return <>
        {answersLoading && <span>Loading...<br/></span>}
        {answersError && <span>{answersError.message}<br/></span>}
        {canEdit && <div><span>Allow Editing</span> <input type="checkbox" onChange={handleAllowEditing} checked={editingAllowed} /></div> }
        <hr/>
        <TastingAnswers 
            answers={userAnswers} 
            beers={beers} 
            showForBartender={isBartender} 
            editingAllowed={editingAllowed} 
            onClickItemAtIndex={ handleClickItemAtIndex }
        />
        <h3>Results</h3>
        {resultsLoading && <span>Loading...<br/></span>}
        {resultsError && <span>{resultsError.message}<br/></span>}
        <TastingResults 
            results={tastingResults}
        />
        <br/>
        <button onClick={handleCalculateResults}>
            {resultsAvailable ? 'Rec' : 'C'}alculate Results
        </button>
    </>
}
export default Tasting;