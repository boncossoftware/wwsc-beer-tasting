import { Result } from "store/reducers/results/reducer";

type TastingResultsProps = {
    results?: Result
}

const TastingResults = ({results}:TastingResultsProps) => {
    const {
        lastUpdated = null,
        beerSelection = ['None selected'],
        tasteScore = ['None selected'],
        beerLover = 'None selected',
        beerHater = 'None selected',
    } = {//results || {
        lastUpdated: new Date(),
        beerSelection: ['Israel', 'John', 'Jim'],
        tasteScore: ['Heineken', 'Chill', 'Balashi'],
        beerLover: 'Israel',
        beerHater: 'Jim',
    };

    const available = Boolean(lastUpdated);
    if (available) {
        return <>
            <span>Ranking:<br/></span>
            {beerSelection?.map( (s,i) => 
                <span key={i}>&emsp; {s}<br/></span>    
            )}
            <br/>
            <span>Best Taste scores:<br/></span>
            {tasteScore?.map( (s: string|number, i: number) => 
                <span key={i}>&emsp; {s}<br/></span>    
            )}
            <br/>
            <span>Beer Lover: {beerLover} <br/></span>
            <span>Beer Hater: {beerHater} <br/></span>
        </>
    }
    else {
        return <>
            <span>No results available.<br/></span>
        </>
    }
}
export default TastingResults;