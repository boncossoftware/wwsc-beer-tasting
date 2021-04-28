import { 
    CircularProgress as BaseCircularProgress,
    Container as BaseContainer, 
    styled, 
    Typography,
    Link,
} from '@material-ui/core';
import {
    Alert
} from '@material-ui/lab';
import { NavLink } from 'react-router-dom';
import BaseMadeByBoncos from 'components/made-by-boncos';

export const Container = styled(p => 
    <BaseContainer maxWidth='sm' {...p}/>
)(
    p => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: p.theme.spacing(5),
    })
);

export const Title = styled((p) => 
    <Typography variant="h4" {...p} />
)({

});

export const Subtitle = styled((p) => 
    <Typography variant="subtitle1" {...p} />) 
({

});

export const FormContainer = styled(p => 
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

export const CircularProgress = styled(p => 
    <BaseCircularProgress size={40} {...p}/>
)({
    
});

export const OptionsContainer = styled(p => 
    <BaseContainer {...p}/>
)( ({theme}) => ({
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: theme.spacing(3),
}));

export const OptionLink = styled(p => 
    <Link component={NavLink} {...p} /> 
)({

})

export const ErrorMessage = styled(p=>
    <Alert 
        elevation={6} 
        variant="filled" 
        severity="error" 
        {...p}
    />
)({
    
});

export const MadeByBoncos = styled(p=> 
    <BaseMadeByBoncos {...p} />
)(({theme}) => ({
    position: 'absolute',
    bottom: theme.spacing(3),
    zIndex: 10001
}));