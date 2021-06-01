import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootState } from "store";
import { TastingEvent } from "store/reducers/events/reducer";
import BeerList from "../../components/beer-list";

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
    return <>
        {loading && "loading..."}
        {!loading && <>
            <h4>Beers</h4>
            <br/>
            <BeerList beers={beers} />
        </>}
    </>
}
export default Beers;