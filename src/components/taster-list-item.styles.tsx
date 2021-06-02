import { styled } from "@material-ui/core";
import { ListItemText } from "@material-ui/core";

export const TasterName = styled(({...p})=> 
    <ListItemText {...p} />
)(({theme}) => ({
}));