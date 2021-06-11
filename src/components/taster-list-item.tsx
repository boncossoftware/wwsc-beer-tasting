import { Checkbox, ListItem, ListItemIcon } from "@material-ui/core";
import { MouseEventHandler } from "react";
import {TasterName} from './taster-list-item.styles';

export type TasterListItemProps = {
    taster: string | null,
    onClick?: MouseEventHandler<HTMLDivElement>,
    selected?: boolean,
    disabled?: boolean,
    selectable?: boolean
}


const TasterListItem = ({
    taster,
    onClick,
    disabled = false,
    selected = false,
    selectable = false,
}: TasterListItemProps) => {
    const ItemComponent = (p: any) => (
        selectable ? <ListItem {...p} button /> : <ListItem {...p} />
    );
    return (
        <ItemComponent
            onClick={onClick}
            divider
            disabled={disabled}
            disableGutters
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
            <TasterName>{taster}</TasterName>
        </ItemComponent>
    );
};
export default TasterListItem;