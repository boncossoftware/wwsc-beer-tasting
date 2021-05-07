import { 
    CircularProgress as BaseCircularProgress,
    styled, 
} from '@material-ui/core';

const FormContainer = styled(p => 
    <div {...p}/>
)( ({theme}) => ({
    width: '100%',
    maxWidth: '400px',
    minHeight: '300px',
    paddingTop: theme.spacing(3),

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '& .MuiCircularProgress-root': {
        marginTop: 'calc(50% - 40px)'
    }

}));

export default FormContainer;

export const CircularProgress = styled(p => 
    <BaseCircularProgress size={40} {...p}/>
)({
    
});