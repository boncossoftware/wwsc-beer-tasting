import { useSelector } from "react-redux";
import { useParams } from "react-router";
import BeerList from "../../components/beer-list";

const Beers = () => {    
    const {id} = useParams();
    const { beers } = useSelector( s => s?.events?.items?.find( i => i.id === id ) ) || {};
    const loading = useSelector( s => s?.events?.loading );
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