import { format } from "date-fns";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

const Venue = () => {    
    const {id} = useParams();
    const { venue, date, price } = useSelector( s => s?.events?.items?.find( i => i.id === id ) ) || {};
    const loading = useSelector( s => s?.events?.loading );

    const renderTime = () => {
        const formattedTime = date ? format(date, 'hh:mm aaa') : '-';
        return <>Time: {formattedTime}<br/></>
    }

    const renderDate = () => {
        const formattedDate = date ? format(date, 'dd MMM, yyyy') : 'No Date set';
        return <>Date: {formattedDate}<br/></>
    }

    const renderPrice = () => {
        return <>Price: {price}<br/> </>
    }

    return <>
        {loading && "loading..."}
        {!loading && <>
            <h2>{venue}</h2>
            <br/>
            {renderTime()}
            {renderDate()}
            {renderPrice()}
        </>}
    </>
}
export default Venue;