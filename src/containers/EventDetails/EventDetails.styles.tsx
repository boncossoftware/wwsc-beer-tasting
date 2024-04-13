import {
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Button,
    styled,
    Typography,
} from "@material-ui/core";
import {
    ArrowBackIos as BackIcon,
    EmojiEvents as TastingIcon,
    FormatListNumbered as ResultsIcon,
    LocalDrink as BeerIcon,
    People as TastersIcon,
    PlaceOutlined as VenueIcon,
} from "@material-ui/icons";
import FullPageCircularProgress from "components/full-page-circular-progress";

export const Container = styled(({ ...p }) =>
    <div {...p} />
)(({ theme }) => ({
    marginBottom: theme.mixins.toolbar.minHeight,
}));;

export const BackButton = styled((p) =>
    <Button color="inherit" {...p} >
        <BackIcon />
        <Typography variant="button" color="inherit">Events</Typography>
    </Button>
)(({ theme }) => ({
    marginRight: theme.spacing(1),
    '& svg': {
        fontSize: 'inherit',
        marginBottom: 3
    }
}));

export const EditButton = styled(({ ...p }: any) =>
    <Button color="inherit" {...p} >
        <Typography color="inherit">Edit</Typography>
    </Button>
)(({ theme }) => ({
    marginLeft: theme.spacing(1),
}));

export const CircularProgress = FullPageCircularProgress;


export const BottomNavigationBar = styled(({ className, ...p }: any) =>
    <Box
        boxShadow={3}
        className={className}
    >
        <BottomNavigation

            showLabels
            {...p}
        />
    </Box>
)({
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 1,
    '& .MuiBottomNavigation-root': {
        height: 'calc(54px + 14px)',
        paddingBottom: '14px',
    },
});

export const TastingBarItem = styled(({ ...p }) =>
    <BottomNavigationAction
        label="Tasting"
        icon={
            <TastingIcon />
        }
        {...p}
    />
)({

});

export const ResultsBarItem = styled(({ ...p }) =>
    <BottomNavigationAction
        label="Results"
        icon={
            <ResultsIcon />
        }
        {...p}
    />
)({

});

export const BeersBarItem = styled(({ ...p }) =>
    <BottomNavigationAction
        label="Beers"
        icon={
            <BeerIcon />
        }
        {...p}
    />
)({

});


export const TastersBarItem = styled(({ ...p }) =>
    <BottomNavigationAction
        label="Tasters"
        icon={
            <TastersIcon />
        }
        {...p}
    />
)({

});

export const VenueBarItem = styled(({ ...p }) =>
    <BottomNavigationAction
        label="Venue"
        icon={
            <VenueIcon />
        }
        {...p}
    />
)({

});