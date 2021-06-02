import { List, Typography } from "@material-ui/core";
import { MouseEvent } from "react";
import TasterListItem from './taster-list-item';

export type TasterListProps = {
    tasters?: (string|null)[], 
    onClickTaster?: (taster: string|null, event?: MouseEvent<HTMLDivElement>) => void,  
    isTasterDisabled?: ((taster: string|null) => boolean),
    isTasterSelected?: ((taster: string|null) => boolean),
    itemsSelectable?: boolean
}

const TasterList = ({
    tasters=[], 
    onClickTaster, 
    isTasterDisabled, 
    isTasterSelected,
    itemsSelectable=false
}: TasterListProps) => {
    
    const handleClickTaster = (taster: string|null, event: MouseEvent<HTMLDivElement>) => {
        onClickTaster && onClickTaster(taster, event);
    };

    const renderItems = () => {
        return tasters.map( (taster, index) => {
            const disabled = (isTasterDisabled && isTasterDisabled(taster)) || false;
            const selected = (isTasterSelected && isTasterSelected(taster)) || false;
            return (
                <TasterListItem 
                    key={index} 
                    taster={taster} 
                    onClick={ event => handleClickTaster(taster, event)}
                    selected={selected}
                    disabled={disabled}
                    selectable={itemsSelectable}
                />
            );
        });
    }
    
    if (tasters.length === 0) {
        return <Typography>No tasters added</Typography>
    }
    else {
        return <List>{renderItems()}</List>
    }
}   
export default TasterList;
