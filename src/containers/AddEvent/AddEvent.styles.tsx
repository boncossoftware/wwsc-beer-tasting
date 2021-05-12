import { Button, styled, Typography } from "@material-ui/core";

export const CancelButton = styled( (p) => 
    <Button {...p} color="inherit" >
        <Typography variant="button" color="inherit">Cancel</Typography>
    </Button>
)(({theme}) => ({
    marginRight: theme.spacing(1),
}));


export const AddButton = styled( (p: any) => 
    <Button {...p} color="inherit" disabled={p.saving || false}>
        <Typography color="inherit">{p.saving ? 'Adding...' : 'Add'}</Typography>
    </Button>
)(({theme}) => ({
    marginLeft: theme.spacing(1),
    fontWeight: 'bold'
}));