import {
    Container as BaseContainer, 
    Grid, 
    styled,
    Avatar,
    Typography
} from '@material-ui/core';
import { 
    LocationCity as VenueIcon, 
} from "@material-ui/icons";
import FullPageCircularProgress from "components/full-page-circular-progress";
import BaseSection from 'components/section-grid';


export const CircularProgress = FullPageCircularProgress;
export const Section = BaseSection;
export const Container = styled( ({...p}) =>
    <BaseContainer {...p} />
)(({theme}) => ({
    paddingBottom: theme.spacing(4),
}));

export const VenueInfoHeader = styled( ({venue, ...p}) =>
    <Grid 
        container 
        spacing={1} 
        alignItems='center'
        {...p}
    >
        <Grid item >
            <Avatar>
                <VenueIcon fontSize="large"/>
            </Avatar>
        </Grid>
        <Grid item >
            <Typography variant="h4" >
                {venue}
            </Typography>
        </Grid>
    </Grid>
)(({theme}) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),

    '& .MuiAvatar-root': {
        width: theme.spacing(7),
        height: theme.spacing(7),
    }
}));

export const VenueInfoItem = styled( ({title, value, ...p}) =>
    <Grid 
        container 
        spacing={2} 
        alignItems='center'
        {...p}
    >
        <Grid item >
            <Typography 
                variant="subtitle2" 
            >
                {title}
            </Typography>
        </Grid>
        <Grid item >
            <Typography 
                variant="subtitle1" 
            >
                {value}
            </Typography>
        </Grid>
    </Grid>
)(({theme}) => ({
    
}));