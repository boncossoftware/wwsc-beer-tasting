import { 
    styled, Typography, 
} from "@material-ui/core";
import { ArrowForwardIos } from "@material-ui/icons";

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