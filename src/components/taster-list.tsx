import { List, Typography } from "@material-ui/core";
import { MouseEvent } from "react";
import TasterListItem from './taster-list-item';
import { User } from "@/store/reducers/users/reducer";

export type TasterListProps = {
    tasters?: User[] | null,
    onClickTaster?: (taster: User, event?: MouseEvent<HTMLDivElement>) => void,
    isTasterDisabled?: ((taster: User) => boolean),
    isTasterSelected?: ((taster: User) => boolean),
    itemsSelectable?: boolean
}

const TasterList = ({
    tasters = [],
    onClickTaster,
    isTasterDisabled,
    isTasterSelected,
    itemsSelectable = false
}: TasterListProps) => {

    const handleClickTaster = (taster: User, event: MouseEvent<HTMLDivElement>) => {
        onClickTaster && onClickTaster(taster, event);
    };

    const renderItems = () => {
        return tasters?.map((taster, index) => {
            const disabled = (isTasterDisabled && isTasterDisabled(taster)) || false;
            const selected = (isTasterSelected && isTasterSelected(taster)) || false;
            return (
                <TasterListItem
                    key={index}
                    taster={taster}
                    onClick={event => handleClickTaster(taster, event)}
                    selected={selected}
                    disabled={disabled}
                    selectable={itemsSelectable}
                />
            );
        });
    }

    if (tasters?.length === 0) {
        return <Typography>No tasters added</Typography>
    }
    else {
        return <List disablePadding>{renderItems()}</List>
    }
}
export default TasterList;
