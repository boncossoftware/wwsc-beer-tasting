
import ErrorMessage from "components/error-message";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { RootState, StoreError, UserInfo } from "store/reducer";
import { TastingAnswer } from "store/reducers/answers/reducer";
import { TastingEvent } from "store/reducers/events/reducer";
import { Result } from "store/reducers/results/reducer";
import TastingAnswers from "../../components/tasting-answers";
import TastingResults from "../../components/tasting-results";
import { answers, events, results } from "../../store";
import { 
    Container,
    AllowEditField, 
    CalculateResultsButton, 
    CircularProgress, 
    ResultsCircularProgress, 
    Section
} from './Tasting.styles';

export type TastingProps = {
    baseURL : string
}

const Tasting = ({baseURL}: TastingProps) => {    
    const history = useHistory();
    const {id} = useParams<{id: string}>();

    const dispatch = useDispatch();
    const user = useSelector<RootState, UserInfo|null>( s => s?.auth?.user);
    
    const answersLoading = useSelector<RootState, boolean>( s => s?.answers?.itemsLoading[id] );
    const answersError = useSelector<RootState, StoreError|undefined>( s => s?.answers?.itemsError[id] );
    const userAnswers = useSelector<RootState, TastingAnswer|undefined>( 
        s => s?.answers?.items?.find( i => i.id === id ) 
    );

    const resultsLoading = useSelector<RootState, boolean>( s => s?.results?.itemsLoading[id] );
    const resultsError = useSelector<RootState, StoreError|undefined>( s => s?.results?.itemsError[id] );
    const tastingResults = useSelector<RootState, Result|undefined>( 
        s => s?.results?.items?.find( i => i.id === id ) 
    );
    const resultsCalculating = useSelector<RootState, boolean>( s => s?.results?.itemsCalculating[id] );
    const resultsCalculationError = useSelector<RootState, StoreError|undefined>( 
        s => s?.results?.itemsCalculationError[id] 
    );
    
    const tastingEvent = useSelector<RootState, TastingEvent>( 
        s => s?.events?.items?.find( i => i.id === id ) || {} as TastingEvent 
    );

    const bartender = tastingEvent.bartender;
    const owner = tastingEvent.owner;
    const editingAllowed = Boolean(tastingEvent.editingAllowed);
    const isBartender = bartender === user?.email;
    const canEdit = (owner === user?.email);
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

    const handleClickItemAtIndex = (index: number) => {
        (index !==undefined && history.push(`${baseURL}/round/${index + 1}`));
    }

    const handleCalculateResults = () => {
        dispatch( results.calculate(id) );
    }

    return <Container id="tasting" >
        {answersLoading ? 
            <CircularProgress />
            :
            <>
                <Section title="Answers">
                    {answersError && <ErrorMessage error={answersError} />}
                    {canEdit && 
                        <AllowEditField 
                            onChange={handleAllowEditing} 
                            value={editingAllowed} 
                        />
                    }
                    {userAnswers && 
                        <TastingAnswers 
                            answers={userAnswers} 
                            showForBartender={isBartender} 
                            editingAllowed={editingAllowed} 
                            onClickItemAtIndex={ handleClickItemAtIndex }
                        />
                    }
                </Section>
                <Section title="Results">
                    {(resultsLoading || resultsCalculating) ? 
                        <ResultsCircularProgress />
                        :
                        <>
                            {(resultsError || resultsCalculationError) && 
                                <ErrorMessage error={resultsError || resultsCalculationError } />
                            }
                            <TastingResults results={tastingResults} />
                            <CalculateResultsButton 
                                onClick={handleCalculateResults}
                            >
                                {resultsAvailable ? 'Rec' : 'C'}alculate Results
                            </CalculateResultsButton>
                        </>
                    }   
                </Section>
            </>
        }
    </Container>
}
export default Tasting;