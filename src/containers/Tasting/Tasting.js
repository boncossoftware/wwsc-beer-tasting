import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import TastingAnswers from "../../components/tasting-answers";
import TastingResults from "../../components/tasting-results";
import { answers, events, results } from "../../store";

const Tasting = ({baseURL}) => {    
    const history = useHistory();
    const {id} = useParams();

    const dispatch = useDispatch();
    const user = useSelector( s => s?.auth?.user);
    
    const answersLoading = useSelector( s => s?.answers?.itemsLoading[user.uid] );
    const answersError = useSelector( s => s?.answers?.itemsError[user.uid] );
    const userAnswers = useSelector( s => s?.answers?.items?.find( i => i.id === user.uid ) );

    const resultsLoading = useSelector( s => s?.results?.itemsLoading[id] );
    const resultsError = useSelector( s => s?.results?.itemsError[id] );
    const tastingResults = useSelector( s => s?.results?.items?.find( i => i.id === id ) );

    const resultsCalculating = useSelector( s => s?.results?.itemsCalculating[id] );
    const resultsCalculationError = useSelector( s => s?.results?.itemsCalculationError[id] );
    
    const {
        bartender, 
        owner,
        editingAllowed=false
    } = useSelector( s => s?.events?.items?.find( i => i.id === id ) ) || {};
    
    const isBartender = bartender === user?.email;
    const canEdit = (owner === user?.uid);
    const resultsAvailable = Boolean(tastingResults?.lastUpdated);

    useEffect( () => {
        dispatch( answers.loadItem(id) );
        dispatch( results.loadItem(id) );
    }, [dispatch, id] );

    const handleAllowEditing = () => {
        const message = editingAllowed ? 
            'Are you sure you want to stop editing answers?'
            :
            'Are you sure you want to allow editing answers?'
        ;
        if (window.confirm(message)) {
            dispatch( events.allowEdit(id, !editingAllowed) );
        } 
    }

    const handleClickItemAtIndex = (index) => {
        (index !==undefined && history.push(`${baseURL}/round/${index + 1}`));
    }

    const handleCalculateResults = () => {
        dispatch( results.calculate(id) );
    }

    return <>
        {answersLoading && <span>Loading...<br/></span>}
        {answersError && <span>{answersError.message}<br/></span>}
        {canEdit && <div><span>Allow Editing</span> <input type="checkbox" onChange={handleAllowEditing} checked={editingAllowed} /></div> }
        <hr/>
        <TastingAnswers 
            answers={userAnswers} 
            showForBartender={isBartender} 
            editingAllowed={editingAllowed} 
            onClickItemAtIndex={ handleClickItemAtIndex }
        />
        <h3>Results</h3>
        {resultsLoading && <span>Loading...<br/></span>}
        {resultsError && <span>{resultsError.message}<br/></span>}
        {resultsCalculating ?
            <span>Calculating...</span>
            :
            (resultsCalculationError ?
                <span>{resultsCalculationError.message}</span>
                :
                <TastingResults 
                    results={tastingResults}
                />
            )
        }
        <br/>
        <button onClick={handleCalculateResults}>
            {resultsAvailable ? 'Rec' : 'C'}alculate Results
        </button>
    </>
}
export default Tasting;