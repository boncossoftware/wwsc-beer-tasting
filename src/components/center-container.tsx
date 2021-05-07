import { 
    Container as BaseContainer, 
    styled, 
} from '@material-ui/core';

const CenterContainer = styled(p => 
    <BaseContainer maxWidth='sm' {...p}/>
)(
    p => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: p.theme.spacing(5),
    })
);
export default CenterContainer;