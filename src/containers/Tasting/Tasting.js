import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import TastingAnswers from "../../components/tasting-answers";
import { answers } from "../../store";

const Tasting = () => {    
    const {eventID} = useParams();
    const dispatch = useDispatch();
    const loading = useSelector( s => s?.answers?.itemsLoading[eventID] );
    const error = useSelector( s => s?.answers?.itemsError[eventID] );
    const item = useSelector( s => s?.answers?.items?.find( i => i.id === eventID ) );
    const {beers} = useSelector( s => s?.events?.items?.find( i => i.id === eventID ) ) || {};
    
    useEffect( () => {
        dispatch( answers.loadItem(eventID) );
    }, [dispatch, eventID] );

    return <>
        <div><span>Allow Editing</span> <input type="checkbox" /></div>
        {loading && <span>Loading...</span>}
        {error && <span>{error.message}</span>}
        <TastingAnswers answers={item} beers={beers} />
    </>
}
export default Tasting;