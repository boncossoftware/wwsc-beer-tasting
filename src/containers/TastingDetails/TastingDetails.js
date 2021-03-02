import { useParams } from "react-router";

const TastingDetails = () => {   
    const {round} = useParams(); 
    const roundIndex = round !== undefined ? (round - 1) : null;

    return <span>Tasting Details - Round: {round}, Index:{roundIndex} </span>;
}
export default TastingDetails