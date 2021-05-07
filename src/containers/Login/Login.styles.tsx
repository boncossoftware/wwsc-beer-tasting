import { 
    Container as BaseContainer, 
    styled, 
    Typography,
} from '@material-ui/core';
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

export const MadeByBoncos = styled(p=> 
    <BaseMadeByBoncos {...p} />
)(({theme}) => ({
    position: 'absolute',
    bottom: theme.spacing(3),
    zIndex: 10001
}));