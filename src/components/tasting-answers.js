

const TastingAnswers = ({answers, beers}) => {
    const beerSelected = answers?.beers || [];
    const rounds = answers?.rounds || 10;
    console.log(beers);

    const renderItems = () => {
        let i, items=[];
        for (i = 0; i < rounds; i++) {
            let beer =  beers[beerSelected[i]]
            items.push( <div key={i}> {`Round ${i}`}<br/></div> );
        }
        return items;
    }

    return <>
        {renderItems()}
    </>
}
export default TastingAnswers;