const TastingResults = ({results}) => {
    const {
        lastUpdated = null,
        beerSelection = ['None selected'],
        tasteScore = ['None selected'],
        beerLover = 'None selected',
        beerHater = 'None selected',
    } = results || {};

    const available = Boolean(lastUpdated);
    if (available) {
        return <>
            <span>Beer selection:<br/></span>
            {beerSelection.map( (s,i) => 
                <span key={i}>&emsp; {s}<br/></span>    
            )}
            <br/>
            <span>Taste score:<br/></span>
            {tasteScore.map( (s,i) => 
                <span key={i}>&emsp; {s}<br/></span>    
            )}
            <br/>
            <span>Beer Lover: {beerLover} <br/></span>
            <span>Beer Hater: {beerHater} <br/></span>
        </>
    }
    else {
        return <>
            <span>No Results available yet.<br/></span>
        </>
    }
}
export default TastingResults;