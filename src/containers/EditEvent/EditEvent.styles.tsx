import { 
    Button, 
    styled, 
    Typography, 
    CircularProgress as BaseCircularProgress
} from "@material-ui/core";
import {
    Alert
} from '@material-ui/lab';

export const CancelButton = styled( (p) => 
    <Button {...p} color="inherit" >
        <Typography variant="button" color="inherit">Cancel</Typography>
    </Button>
)(({theme}) => ({
    marginRight: theme.spacing(1),
}));


export const UpdateButton = styled( ({isSaving, ...p}: any) => 
    <Button {...p} color="inherit" disabled={isSaving || false}>
        <Typography color="inherit">{isSaving ? 'Updating...' : 'Update'}</Typography>
    </Button>
)(({theme}) => ({
    marginLeft: theme.spacing(1),
    fontWeight: 'bold'
}));

export const CircularProgress = styled(p=> 
    <BaseCircularProgress {...p} size={40} />    
)(({theme}) => ({
    marginLeft: 'calc(50% - 20px)',
    marginTop: `calc(50vh - ${theme.mixins.toolbar.minHeight}px - 20px)`
}));

export const InformationMessage = styled(p=>
    <Alert 
        elevation={6} 
        variant="filled" 
        severity="info" 
        {...p}
    />
)(({theme}) => ({
    marginBottom: theme.spacing(3)
}));
