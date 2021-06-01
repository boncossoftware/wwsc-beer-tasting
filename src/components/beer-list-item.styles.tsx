import { styled } from "@material-ui/core";
import { ListItemText } from "@material-ui/core";

export const BeerName = styled(({preSelectedIndex, ...p})=> 
    <ListItemText 
        primaryTypographyProps={{
            className: ((preSelectedIndex >= 0) ? 'selected' : undefined)
        }}
        secondary={ (preSelectedIndex >= 0) && 
            `Selected in round ${preSelectedIndex + 1}`
        }
        {...p}
    />
)(({theme}) => ({
    '& .selected': {
        opacity: 0.5
    }
}));