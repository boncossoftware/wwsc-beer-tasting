import {
    Alert
} from '@material-ui/lab';
import { 
    styled, 
} from '@material-ui/core';

const ErrorMessage = styled( ({children, error, ...p})=>
    <Alert 
        elevation={6} 
        variant="filled" 
        severity="error" 
        {...p}
    >   
        {error && `${error?.message}(${error?.code})` }
        {children}
    </Alert>
)(({theme}) => ({
    marginBottom: theme.spacing(3)
}));

export default ErrorMessage;
