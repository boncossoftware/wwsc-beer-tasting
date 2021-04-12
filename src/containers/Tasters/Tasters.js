import { useSelector } from "react-redux";
import { useParams } from "react-router";
import TasterList from "../../components/taster-list";

const Tasters = () => {    
    const {eventID} = useParams();
    const { tasters } = useSelector( s => s?.events?.items?.find( i => i.id === eventID ) ) || {};
    const loading = useSelector( s => s?.events?.loading );
    return <>
        {loading && "loading..."}
        {!loading && <>
            <h4>Tasters</h4>
            <br/>
            <TasterList tasters={tasters} />
        </>}
    </>
}
export default Tasters;