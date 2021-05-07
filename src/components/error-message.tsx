import {
    Alert
} from '@material-ui/lab';
import { 
    styled, 
} from '@material-ui/core';

const ErrorMessage = styled(p=>
    <Alert 
        elevation={6} 
        variant="filled" 
        severity="error" 
        {...p}
    />
)(({theme}) => ({
    marginBottom: theme.spacing(3)
}));

export default ErrorMessage;
