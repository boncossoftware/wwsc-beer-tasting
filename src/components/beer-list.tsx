import { List, Typography } from "@material-ui/core";
import { MouseEvent } from "react";
import BeerListItem from './beer-list-item';

type BeerListProps = {
    beers?: (string|null)[], 
    onClickBeer?: (beer: string|null, event?: MouseEvent<HTMLDivElement>) => void, 
    beerPreselectedIndex?: ((beer: string|null) => number), 
    isBeerSelected?: ((beer: string|null) => boolean),
    itemsSelectable?: boolean
}

const BeerList = ({
    beers=[], 
    onClickBeer, 
    beerPreselectedIndex, 
    isBeerSelected,
    itemsSelectable=true
}: BeerListProps) => {
    
    const handleClickBeer = (beer: string|null, event?: MouseEvent<HTMLDivElement>) => {
        onClickBeer && onClickBeer(beer, event);
    };

    const renderItems = () => {
        return beers.map( (beer, index) => {
            let preSelectedIndex = (beerPreselectedIndex && beerPreselectedIndex(beer));
            const selected = (isBeerSelected && isBeerSelected(beer)) || false;
            return (
                <BeerListItem 
                    key={index} 
                    beer={beer} 
                    onClick={ event => handleClickBeer(beer, event)}
                    selected={selected}
                    preSelectedIndex={preSelectedIndex}
                    selectable={itemsSelectable}
                />
            );
        });
    }
    
    if (beers.length === 0) {
        return <Typography>No beers added</Typography>
    }
    else {
        return <List disablePadding>{renderItems()}</List>;
    }
}   
export default BeerList;
