import { 
    BottomNavigation, 
    BottomNavigationAction, 
    Button, 
    styled, 
    Typography,
    CircularProgress as BaseCircularProgress
} from "@material-ui/core";
import { 
    ArrowBackIos as BackIcon, 
    EmojiEvents as TastingIcon, 
    LocalDrink as BeerIcon,
    People as TastersIcon,
    LocationCity as VenueIcon,
} from "@material-ui/icons";

export const Container = styled( ({...p})=> 
    <div {...p} />
)(({theme}) => ({
    marginBottom: theme.mixins.toolbar.minHeight,
}));;

export const BackButton = styled( (p) => 
<Button color="inherit" {...p} >
    <BackIcon />
    <Typography variant="button" color="inherit">Events</Typography>
</Button>
)(({theme}) => ({
    marginRight: theme.spacing(1),
    '& svg': {
        fontSize: 'inherit',
        marginBottom: 3
    }
}));

export const EditButton = styled( ({...p}: any) => 
<Button color="inherit" {...p} >
    <Typography color="inherit">Edit</Typography>
</Button>
)(({theme}) => ({
    marginLeft: theme.spacing(1),
}));

export const CircularProgress = styled(p=> 
    <BaseCircularProgress {...p} size={40} />    
)(({theme}) => ({
    marginLeft: 'calc(50% - 20px)',
    marginTop: `calc(50vh - ${theme.mixins.toolbar.minHeight}px - 20px)`
}));


export const BottomNavigationBar = styled(({...p}: any) => 
    <BottomNavigation
        showLabels
        {...p}
    />
)({
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 1,
});

export const TastingBarItem = styled(({...p}) =>
    <BottomNavigationAction 
        label="Tasting" 
        icon={
            <TastingIcon />
        } 
        {...p} 
    />
)({

});

export const BeersBarItem = styled(({...p}) =>
    <BottomNavigationAction 
        label="Beers" 
        icon={
            <BeerIcon />
        } 
        {...p} 
    />
)({

});


export const TastersBarItem = styled(({...p}) =>
    <BottomNavigationAction 
        label="Tasters" 
        icon={
            <TastersIcon />
        } 
        {...p} 
    />
)({

});

export const VenueBarItem = styled(({...p}) =>
    <BottomNavigationAction 
        label="Venue" 
        icon={
            <VenueIcon />
        } 
        {...p} 
    />
)({

});