import { Checkbox, ListItem, ListItemIcon } from "@material-ui/core";
import { MouseEventHandler } from "react";
import { BeerName } from './beer-list-item.styles';

export type BeerListItemProps = {
    beer: string | null,
    onClick?: MouseEventHandler<HTMLDivElement>,
    preSelectedIndex?: number,
    selected?: boolean
}

const BeerListItem = ({
    beer,
    onClick,
    preSelectedIndex = -1,
    selected = false
}: BeerListItemProps) => {
    return (
        <ListItem
            onClick={onClick}
            divider
            button
        >
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={selected}
                    tabIndex={-1}
                    disableRipple
                />
            </ListItemIcon>
            <BeerName 
                preSelectedIndex={preSelectedIndex}
            >
                {beer}
            </BeerName>
        </ListItem>
    )
};
export default BeerListItem;