export const BeerListItem = ({beer, onClick, disabled=false, selected=false}) => (
    <div onClick={ onClick }>
        { disabled ? 
            <span style={{color: "gray"}}><i>{beer}</i></span>
            :
            <span>{beer}</span>                   
        }              
        {selected && <span style={{float:'right'}}>&#10003;</span>}
        <br/>
        <hr/>
    </div>
);

const BeerList = ({beers=[], onClickBeer, isBeerDisabled, isBeerSelected}) => {
    
    const handleClickBeer = (beer, event) => {
        onClickBeer && onClickBeer(beer, event);
    };

    const renderItems = () => {
        return beers.map( (beer, index) => {
            const disabled = (isBeerDisabled && isBeerDisabled(beer)) || false;
            const selected = (isBeerSelected && isBeerSelected(beer)) || false;
            return (
                <BeerListItem 
                    key={index} 
                    beer={beer} 
                    onClick={ event => handleClickBeer(beer, event)}
                    selected={selected}
                    disabled={disabled}
                />
            );
        });
    }
    
    if (beers.length === 0) {
        return <>No beers added</>
    }
    else {
        return renderItems();
    }
}   
export default BeerList;
