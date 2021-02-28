const TastingResults = ({results}) => {
    const lastUpdated = results?.lastUpdated || null;

    const available = Boolean(lastUpdated);
    if (available) {
        return <span>Results available.<hr/><br/></span>
    }
    else {
        return <>
            <span>No Results available yet.<hr/><br/></span>
        </>
    }
}
export default TastingResults;