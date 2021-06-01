import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootState } from "store";
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
    const loading = useSelector<RootState, boolean>( s => s?.events?.loading );
    const beers = event?.beers || undefined;
    return (
        <Container id="beers">
            {loading ?
                    <CircularProgress />
                :
                <Section title="Beers">
                    <BeerList beers={beers} itemsSelectable={false} />
                </Section>
            }
        </Container>
    );
}
export default Beers;