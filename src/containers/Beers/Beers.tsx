import ErrorMessage from "components/error-message";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootState, StoreError } from "store";
import { TastingEvent } from "store/reducers/events/reducer";
import BeerList from "../../components/beer-list";
import {
    Container,
    CircularProgress,
    Section
} from './Beers.styles';

export type BeersParams = {
    id:string
}

const Beers = () => {    
    const {id} = useParams<BeersParams>();
    const event = useSelector<RootState, TastingEvent|undefined>( 
        s => s?.events?.items?.find( i => i.id === id ) 
    );
    const error = useSelector<RootState, StoreError|undefined>( 
        s => s?.events?.itemsError[id]
    );
    const loading = useSelector<RootState, boolean>( 
        s => s?.events?.itemsLoading[id] 
    );
    const beers = event?.beers || undefined;
    return (
        <Container id="beers" disableGutters>
            {loading ?
                    <CircularProgress />
                :
                <>
                    {error && <ErrorMessage error={error} />}
                    <Section>
                        <BeerList beers={beers} itemsSelectable={false} />
                    </Section>
                </>
            }
        </Container>
    );
}
export default Beers;