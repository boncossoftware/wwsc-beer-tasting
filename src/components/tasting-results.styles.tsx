import { 
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    styled,
    Typography,
} from "@material-ui/core";

export const Subheader = styled(({...p}) => 
    <ListSubheader {...p}/>
)(({theme}) => ({
    
}))

export const RankingResult = styled(({rank, name, points, ...p}) => 
    <ListItem {...p} divider>
        <ListItemIcon>{rank}</ListItemIcon>
        <ListItemText 
            primary={name}
            secondary={points && `${points} Points`}
        />
    </ListItem>
)(({theme}) => ({
    
}))

export const LineItem = styled(({children, ...p}) => 
    <ListItem {...p}>
        <ListItemText>
            {children}
        </ListItemText>
    </ListItem>
)(({theme}) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
}))

export const AchievementItem = styled(({achievement, receiver, ...p}) => 
    <ListItem {...p} divider>
        <ListItemIcon>{achievement}</ListItemIcon>
        <ListItemText>
            {receiver}
        </ListItemText>
    </ListItem>
)(({theme}) => ({
    '& .MuiListItemIcon-root': {
        marginRight: theme.spacing(2),
    }
}))

export const NoResultsMessage = styled( ({...p}) =>
    <Typography {...p}>
        No results available.
    </Typography>
)(({theme}) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));