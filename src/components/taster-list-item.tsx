import { Checkbox, ListItem, ListItemIcon } from "@material-ui/core";
import { MouseEventHandler } from "react";
import { TasterName } from './taster-list-item.styles';
import { User } from "@/store/reducers/users/reducer";

export type TasterListItemProps = {
    taster: User,
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
            <TasterName>{taster.displayName ?? taster.email}</TasterName>
        </ItemComponent>
    );
};
export default TasterListItem;