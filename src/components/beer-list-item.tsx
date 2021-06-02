import { Checkbox, ListItem, ListItemIcon } from "@material-ui/core";
import { MouseEventHandler } from "react";
import { BeerName } from './beer-list-item.styles';

export type BeerListItemProps = {
    beer: string | null,
    onClick?: MouseEventHandler<HTMLDivElement>,
    preSelectedIndex?: number,
    selected?: boolean,
    selectable?: boolean 
}

const BeerListItem = ({
    beer,
    onClick,
    preSelectedIndex = -1,
    selected = false,
    selectable = true,
}: BeerListItemProps) => {
    const ItemComponent = (p: any) => (
        selectable ? <ListItem {...p} button /> : <ListItem {...p} />
    );
    return (
        <ItemComponent
            onClick={onClick}
            divider
        >
            {selectable && 
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={selected}
                        tabIndex={-1}
                        disableRipple
                    />
                </ListItemIcon>
            }
            <BeerName 
                preSelectedIndex={preSelectedIndex}
            >
                {beer}
            </BeerName>
        </ItemComponent>
    )
};
export default BeerListItem;