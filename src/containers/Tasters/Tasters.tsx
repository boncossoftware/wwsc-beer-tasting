import ErrorMessage from "components/error-message";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootState, StoreError } from "store";
import { TastingEvent } from "store/reducers/events/reducer";
import TasterList from "../../components/taster-list";
import {
    Container,
    CircularProgress,
    Section
} from './Tasters.styles';

export type TastersParams = {
    id: string
}

const Tasters = () => {    
    const {id} = useParams<TastersParams>();
    const event = useSelector<RootState, TastingEvent|undefined>( 
        s => s?.events?.items?.find( i => i.id === id ) 
    );
    const loading = useSelector<RootState, boolean|undefined>( 
        s => s?.events?.itemsLoading[id]
    );
    const error = useSelector<RootState, StoreError|undefined>( 
        s => s?.events?.itemsError[id]
    );
    const tasters = event?.tasters || undefined;
    return (
        <Container id="tasters">
            {loading ? 
                <CircularProgress />
                :
                <>
                    {error && <ErrorMessage error={error} />}
                    <Section title="Tasters">
                        <TasterList tasters={tasters} />
                    </Section>
                </>
            }
        </Container>
    );
}
export default Tasters;