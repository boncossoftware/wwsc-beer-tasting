import { 
    styled, Typography, 
} from "@material-ui/core";
import { ArrowForwardIos } from "@material-ui/icons";
import BaseRating from "./rating"

export const Asterisks = styled(({...p}) => 
    <span {...p}>✱</span>
)(({theme}) => ({
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.main
}))

export const DisclosureIndicator = styled(({...p}) => 
    <ArrowForwardIos {...p} />
)({
    fontSize: 15
});

export const Rating = styled(({...p}) => 
    <BaseRating {...p} />
)({
    paddingTop: 1,
    fontSize: 'inherit',
});