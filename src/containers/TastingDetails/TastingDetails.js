import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from "react-router";

const CONFIRM_MESSAGE = 'Discard changes made?';

const TastingDetails = () => {   
    const history = useHistory();
    const dispatch = useDispatch();
    const {id, round} = useParams(); 
    const saved = false;
    const saving = false;
    const changes = false;
    const loading = false;
    const error = null;

    const roundIndex = round !== undefined ? (round - 1) : null;

    useEffect( () => {
        if (saved === true) {
            dispatch({id, roundIndex});
            history.goBack();
        }
    }, [saved, history, dispatch, id, roundIndex]);
    
    const handleCancel = () => {
        if (changes && !window.confirm(CONFIRM_MESSAGE) ) {
            return;
        }
        history.goBack();
    }

    const handleDone = () => {
        //Save the data.
        history.goBack();
    }

    return <>
        <button onClick={handleCancel}>{"Cancel"}</button>
        Round {round}
        <button onClick={handleDone}>{"Save"}</button>
        <hr/>
        {loading && <span>Loading...<br/></span>}
        {saving && <span>Saving...<br/></span>}
        {error && <span>{error.message}<br/></span>}
        <br/>
        <br/>
    </>;
}
export default TastingDetails