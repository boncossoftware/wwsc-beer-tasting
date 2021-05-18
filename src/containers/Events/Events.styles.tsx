import { 
    IconButton, 
    CircularProgress as BaseCircularProgress,
    styled, 
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Typography,
    ListSubheader,
} from "@material-ui/core";
import { 
    AddCircleOutline,
    LocationCity
} from "@material-ui/icons";

export const AddButton = styled(p=> 
    <IconButton color="inherit" {...p}><AddCircleOutline/></IconButton>
)({

});

export const CircularProgress = styled(p=> 
    <BaseCircularProgress {...p} size={40} />    
)(({theme}) => ({
    marginLeft: 'calc(50% - 20px)',
    marginTop: `calc(50vh - ${theme.mixins.toolbar.minHeight}px - 20px)`
}));

export const EventList = styled(p=>
    <List {...p}/>
)({

});

export const EventListSectionHeader = styled(p=>
    <ListSubheader {...p} />
)({

});



export const EventListItem = styled(p=>
    <ListItem divider={true} button {...p} />
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