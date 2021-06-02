import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { AccountCircle as AccountIcon } from "@material-ui/icons";
import { MouseEventHandler, useState } from "react";

export type AccountButtonProps = {
    id?: string,
    onClickLogout?: () => void
}

const OptionsButton = ({onClickLogout, ...p}: AccountButtonProps) => {
    const [menuRef, setMenuRef] = useState<Element|null>(null);

    const handleClickAccountIcon: MouseEventHandler = (event) => {
        setMenuRef(event.currentTarget);
    }

    const handleCloseMenu = () => {
        setMenuRef(null);
    }

    return (<>
        <IconButton 
            color="inherit" 
            onClick={handleClickAccountIcon}
            {...p} 
        >
            <AccountIcon/>
        </IconButton>
        <Menu 
            open={Boolean(menuRef)}
            anchorEl={menuRef}
            onClose={handleCloseMenu}
        >
            <MenuItem onClick={onClickLogout}>Logout</MenuItem>
        </Menu>
    </>);
}
export default OptionsButton;

