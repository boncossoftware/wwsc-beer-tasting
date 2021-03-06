import { 
    IconButton, 
    styled, 
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Typography,
    ListSubheader,
    Container as BaseContainer
} from "@material-ui/core";
import { 
    AddCircleOutline,
    LocationCity
} from "@material-ui/icons";
import FullPageCircularProgress from "components/full-page-circular-progress";

export const Container = styled(p=> 
    <div {...p}/>
)({

});

export const InnerContainer = styled(p=> 
    <BaseContainer {...p}/>
)({

});

export const AddButton = styled(p=> 
    <IconButton color="inherit" {...p}><AddCircleOutline/></IconButton>
)({

});

export const CircularProgress = FullPageCircularProgress;

export const EventList = styled(p=>
    <List {...p}/>
)({

});

export const EventListSectionHeader = styled(p=>
    <ListSubheader {...p} disableGutters/>
)({

});



export const EventListItem = styled(p=>
    <ListItem divider={true} button disableGutters {...p} />
)({
    width: '100%'
});

export type EventListItemDetailsProps = {
    name?: string;
    venue?: string;
    date?: string;
    [key: string]: any 
}  

export const EventListItemDetails = styled( (p: EventListItemDetailsProps) =>
    <>
        <ListItemText 
            primary={p.name} 
            secondary={<>
                <LocationCity fontSize="inherit" />{p.venue}
            </>} 
            {...p} 
        />
        {p.date && <ListItemSecondaryAction>
            <Typography variant="body2">{p.date}</Typography>
        </ListItemSecondaryAction>}
    </>
)({
    '& .MuiSvgIcon-root': {
        marginBottom: -3,
        marginRight: 3,
    }
});